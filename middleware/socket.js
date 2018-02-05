const model = require('../model')
const jwt = require('jsonwebtoken');
const key = require('../config').privateKey;
const async = require('async');

const User = model.user;
const Inbox = model.Inbox;

let clients = {};
global.clients = clients;


module.exports = (io) => {
  //jwt验证
  io.use((client, next) => {
    if (client.handshake.query && client.handshake.query.token) {
      jwt.verify(client.handshake.query.token, key, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        client.userId = decoded;
        next();
      })
    }
    next(new Error('Authentication error'));
  })
  .on('connection', (client) => {
    clients[client.userId] = client
    
    client.on('disconnect', () => {
      if (client.user) {
        delete clients[client.user];
      }
    })

    client.on('sendMessage', ({from, to, message, chatId}) => {

      test({from, to, message, chatId, date});

      const messageItem = {from, to, message, chaId}

      //储存message
      async.parallel({
        from: function(next) {
          User.find({_id: from}, (err, doc) => {
            if (err || !doc) next(err, null);
            next(null, true) 
          })
        },
        to: function(next) {
          User.find({_id: to}, (err, doc) => {
            if (err || !doc) next(err, null);
            next(null, true) 
          })
        }
      },
      function(err, result) {
        if (err) client.emt('error', {errorMsg: '找不到用户'});
        Inbox.findOne({chatId}, (err, doc) => {
          if (err) client.emt('error', { errorMsg: '后端出错' });
          // 之前不存在的chat
          if (!doc) {
            var InboxModel= new Inbox({
              chatId,
              messageList: [messageItem]
            });
            InboxModel.save((err, inbox) => {
              if (err || !inbox) client.emit("serverError", { errorMsg: "后端出错" });
              if(clients[to]) {
                clients[to].emit('receiveMessage', { from, to, message, chaId})
              }
            })
          } else {
            doc.messageList.push(messageItem);
            doc.save((err, doc) => {
              if (er || !doc) client.emit("serverError", { errorMsg: "后端出错" });
              if (clients[to]) {
                clients[to].emit('receiveMessage', { from, to, message, chaId })
              }
            })
          }
        })
      })
    })

    client.on('getUserName', id => {
      User.findOne({_id: id}, (err, user) => {
        if (user) {
          client.emit('userName', user.user)
        } else {
          client.emit('serverError', {errorMsg: '找不到用户'})
        }
      })
    })

    //测试
    function test(data) {
      client.emit('systemlog', {msg: '服务器收到消息: ' + JSON.stringify(data)})
    }
  })
}
const model = require('../model')
const jwt = require('jsonwebtoken');
const key = require('../config').privateKey;
const async = require('async');

const User = model.user;
const Inbox = model.inbox;

let clients = {};
global.clients = clients;


module.exports = (io) => {
  //jwt验证
  io.use((client, next) => {
      if (client.handshake.query && client.handshake.query.token) {
        jwt.verify(client.handshake.query.token, key, (err, decoded) => {
          if (err) return next(new Error('Authentication error'));
          clients[decoded.id] = client.id
          client.userId = decoded.id
          
          next();
        })
      }
      next(new Error('Authentication error'));
    })
    .on('connection', (client) => {

      client.on('disconnect', () => {
        delete clients[client.userId];
      })

      client.on('readChat', (chatId) => {
        const userId = client.userId;
        Inbox.findOne({
          chatId
        }, (err, doc) => {
          if (err) client.emit('error', {
            errorMsg: '后端出错'
          });
          var len = doc.messageList.length;
          for (var i = 0; i < len; i++) {
            let msg = doc.messageList[i];
            if (msg.from._id === userId) {
              msg.fromReaded = true;
            } else {
              msg.toReaded = true;
            }
          }
          doc.save((err, doc) => {})
        });
      })

      
      client.on('sendMessage', ({to, message, chatId}) => {
        const from = client.userId; //fromId由jwt解码
        const messageItem = {from,to,message,chatId}

        //储存message
        async.parallel({
          from: function (next) {
            User.findOne({
              _id: from
            }, {name: 1}, (err, doc) => {
              if (err || !doc) next(err, null);
              next(null, doc);
            })
          },
          to: function (next) {
            User.findOne({
              _id: to
            }, {name: 1}, (err, doc) => {
              if (err || !doc) next(err, null);
              next(null, doc);
            })
          }
        },
        function (err, result) {
          if (err) client.emit('error', {
            errorMsg: '找不到用户'
          });
          Inbox.findOne({
            chatId
          }, (err, doc) => {
            if (err) client.emit('error', {
              errorMsg: '后端出错'
            });
            // 之前不存在的chat
            if (!doc) {
              const talkers = [to, from]
              var inboxEntity = new Inbox({
                chatId,
                talkers,
                messageList: [messageItem]
              });
              inboxEntity.save((err, inbox) => {
                if (err || !inbox) {
                  client.emit("serverError", {
                    errorMsg: "后端出错"
                  });
                  return;
                };
                if (clients[to]) {
                  io.to(clients[to]).emit('receiveMessage', {
                    from: result.from,
                    message,
                    chatId
                  })
                }
              })
            } else {
              doc.messageList.push(messageItem);
              doc.save((err, doc) => {
                if (err || !doc) {
                  client.emit("serverError", {
                    errorMsg: "后端出错"
                  });
                  return;
                }
                if (clients[to]) {
                  io.to(clients[to]).emit('receiveMessage', {
                    from: result.from,
                    message,
                    chatId
                  })
                }
              })
            }
          })
        })
      })

      client.on('fetchUser', _id => {
        User.findOne({
          _id
        }, (err, user) => {
          if (user) {
            client.emit('getUser', {_id, name: user.name})
          } else {
            client.emit('serverError', {
              errorMsg: '找不到用户'
            })
          }
        })
      })

      //测试
      function test(data) {
        client.emit('systemlog', {
          msg: '服务器收到消息: ' + JSON.stringify(data)
        })
      }
    })
}
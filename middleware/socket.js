const model = require('../model')
const User = model.user;

let clients = {};
global.clients = clients;


module.exports = (io) => {
  io.on('connection', (client) => {
    client.on('user', user => {
      clients[user] = client.id;
      client.user = user;
    })
    
    client.on('disconnect', () => {
      if (client.user) {
        delete clients[client.user];
      }
    })

    client.on('sendMessage', ({from, to, message, chatId, date }) => {


      test(message)
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
      client.emit('systemlog', {msg: '服务器收到消息: ' + data})
    }
  })
}
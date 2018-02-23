const model = require('../model');
const async = require('async');
// const User = model.user;
const Inbox = model.inbox;


module.exports = function (app) {
  app.get('/inbox/all', (req, res) => {
    const userId = req.decoded.id;

    Inbox.find({
        chatId: {
          $regex: userId
        }
      }) //new RegExp(userId)
      .populate({
        // "array.field_name" 填充数组内的字段
        path: 'messageList.from messageList.to talkers',
        select: 'name'
      })
      .exec((err, doc) => {
        if (err) {
          return res.status(500).json({
            msg: '服务器出错'
          });
        }
        return res.status(200).json({
          code: 0,
          data: doc
        });
      })
  })
}
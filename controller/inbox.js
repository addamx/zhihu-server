const model = require('../model');
const async = require('async');
// const User = model.user;
const Inbox = model.inbox;


module.exports = function(app) {
  app.get('/inbox/all', (req,res) => {
    const userId = req.decoded.id;
    
    Inbox.findOne({chatId: {$regex: userId}})   //new RegExp(userId)
      .populate({path: 'messageList', populate:{path:'from', select:'name'}, model: 'inbox'})
      .exec((err, doc) => {
        if (err) {
          console.log(err.message)
          return res.status(500).json({ msg: '服务器出错' });
        }
        return res.status(200).json({ code: 0, data: doc });
      })
  })
}
const model = require('../model');
const User = model.user;
const Notice = model.notice;

module.exports.notifyAnswer = ({user, content}) => {
  if (clients.hasOwnProperty(user)) {
    io.to(clients[user]).emit('systemlog', content);
    const entityNotice = new Notice({ content, user });
    entityNotice.save((err, notice) => {
      User.findOneAndUpdate(
        { _id: user },
        { $push: { notices: notice._id } },
        (err, doc) => { }
      )
    })
  }
}
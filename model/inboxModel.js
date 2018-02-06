const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inboxSchema = Schema({
  chatId: { type: String, require: true },
  date: { type: Date, default: Date.now },
  
  messageList: [{
    chatId: { type: String, require: true },
    from: { type: Schema.Types.ObjectId, require: true, ref: 'user' },
    to: { type: Schema.Types.ObjectId, require: true, ref: 'user' },
    message: { type: String, require: true },
    date: { type: Date, defaut: Date.now },
    fromReaded: { type: Boolean, default: false },
    toReaded: { type: Boolean, default: false }
  }]
})


const inbox = mongoose.model('inbox', inboxSchema);

module.exports = inbox;
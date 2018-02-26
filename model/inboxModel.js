const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inboxSchema = Schema({
  chatId: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  },

  // mongoose 不支持dictionary field
  talkers: [
    {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'user'
    }
  ],

  messageList: [{
    chatId: {
      type: String,
      require: true
    },
    from: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'user'
    },
    to: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'user'
    },
    message: {
      type: String,
      require: true
    },
    date: {
      type: Date,
      defaut: Date.now,
      require: true
    },
    fromReaded: {
      type: Boolean,
      default: false,
      require: true
    },
    toReaded: {
      type: Boolean,
      default: false,
      require: true
    }
  }]
})


const inbox = mongoose.model('inbox', inboxSchema);

module.exports = inbox;
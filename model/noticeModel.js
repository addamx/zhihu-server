const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noticeSchema = Schema({
  content: { type: String,require: true },
  date: { type: Date, default: Date.now },
  readed: { type: Boolean, default: false},
  user: {
    ref: 'user',
    type: Schema.Types.ObjectId,
    require: true
  },
})

const notice = mongoose.model('notice', noticeSchema);

module.exports = notice;
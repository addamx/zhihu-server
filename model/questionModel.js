const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = Schema({
  title: { type: String, require: true },
  desc: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  author: {
    ref: 'user',
    type: Schema.Types.ObjectId
  },
  answers: [{ type: Schema.Types.ObjectId, ref: 'answer' }]
})


const question = mongoose.model('question', questionSchema);

// const test = new question({title: 'What is baidu?', desc: '这是问题补充'})
// test.save();

module.exports = question;
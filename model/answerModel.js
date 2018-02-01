const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = Schema({
  content: { type: String, require: true },
  date: { type: Date, default: Date.now },
  author: {
    ref: 'user',
    type: Schema.Types.ObjectId,
    require: true
  },
  question: {
    type:
    Schema.Types.ObjectId,
    ref: 'question',
    require: true
  }
})


const answer = mongoose.model('answer', answerSchema);

// const test = new answer({title: 'What is baidu?', desc: '这是问题补充'})
// test.save();

module.exports = answer;
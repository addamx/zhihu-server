const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: { type: String, require: true },
  pwd: { type: String, require: true },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'question'
  }],
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'answer'
  }]
})


const user = mongoose.model('user', userSchema);

// const test = new user({name: 'Addamx', pwd: 'acdfdfasdf'})
// test.save();

module.exports = user;
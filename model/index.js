require('./db')

module.exports = {
  question: require('./questionModel'),
  answer: require('./answerModel'),
  user: require('./userModel')
}
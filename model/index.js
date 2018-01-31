require('./db')

module.exports = {
  questions: require('./questionModel'),
  answers: require('./answerModel'),
  user: require('./userModel')
}
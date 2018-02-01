const question = require('./question');
const answer = require('./answer');
const user = require('./user');

module.exports = (app) => {
  [
    question,
    answer,
    user,
  ]
  .forEach(p => {
    p(app)
  })
}
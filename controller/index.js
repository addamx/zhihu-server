const question = require('./question');
const answer = require('./answer');
const user = require('./user');
const inbox = require('./inbox');

module.exports = (app) => {
  [
    question,
    answer,
    user,
    inbox
  ]
  .forEach(p => {
    p(app)
  })
}
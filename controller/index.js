const question = require('./question');
const user = require('./user');

module.exports = (app) => {
  [
    question,
    user,
  ]
  .forEach(p => {
    p(app)
  })
}
const question = require('./question');

module.exports = (app) => {
  [
    question,
  ]
  .forEach(p => {
    p(app)
  })
}
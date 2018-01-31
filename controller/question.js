const model = require('../model');
const async = require('async');
const questions = model.questions;


module.exports = function(app) {
  app.get('/question/allquestions', (req,res) => {
    questions
      .find()
      .sort({ date: -1})
      .exec((err, doc) => {
        if (err) {
          return res.status(500).json({msg: '服务器出错'});
        }
        return res.json({ code: 0, data: doc })
      });
  })
}
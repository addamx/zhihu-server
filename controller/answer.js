const model = require('../model');
const async = require('async');
const Answer = model.answer;
const Question = model.question;
const User = model.user;


module.exports = function(app) {
  app.post('/answer/add', (req,res) => {
    const userId = req.decoded.id;
    const { content, questionId } = req.body;

    async.waterfall([
      function(next) {
        const entity = new Answer({ content, questionId, author: userId });
        entity.save((err,doc) => {
          if (err || !doc) return res.status(500).json({msg: "后端出错"});
          next(null, doc);
        })
      },
      function(answer, next) {
        Question.findOneAndUpdate(
          {_id: questionId},
          { $push: {answers: answer._id} },
          (err,doc) => {
            if (err) return res.status(500).json({msg: "后端出错"});
            next(null, answer);
          }
        )
      },
      function(answer, next) {
        User.findOneAndUpdate(
          {_id: userId},
          {$push: { answers: answer._id }},
          (err, doc) => {
          if(err) return res.status(500).json({msg: "后端出错"});
          return res.status(200).json({code: 0, msg: "回答成功"});
        })
      }
    ])
  })
}
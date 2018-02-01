const model = require('../model');
const async = require('async');
const Question = model.question;
const User = model.user;


module.exports = function(app) {
  //获取所有问题
  app.get('/question/allquestions', (req,res) => {
    Question
      .find()
      .sort({ date: -1})
      .exec((err, doc) => {
        if (err) return res.status(500).json({msg: '服务器出错'});
        return res.status(200).json({ code: 0, data: doc });
      });
  });
  //获取问题及其回答
  app.get('/question/view/:id', (req,res) => {
    Question
      .findOne({_id: req.params.id})
      .populate({ path: 'author', select: 'name' })
      .populate({ path: 'answers', populate:({path: 'author', select: 'name'}) })
      .exec((err, doc) => {
        if (err) return res.status(500).json({ msg: '服务器出错' });
        return res.status(200).json({ code: 0, data: doc });
      })
  })
  //添加问题
  app.post('/question/add', (req,res) => {
    const userId = req.decoded.id;
    const { title, desc } = req.body;

    async.waterfall([
      function(next) {
        const entity = new Question({title, desc, author: userId});
        entity.save((err,doc) => {
          if (err || !doc) return res.status(500).json({ msg: '后端出错' });
          next(null, doc)
        })
      },
      function (question, next) {
        User.findOneAndUpdate(
          {_id: userId},
          {
            $push: {
              questions: question._id
            }
          },
          (err, doc) => {
            if (err || !doc) return res.status(500).json({ msg: '后端出错' });
            return res.status(200).json({code: 0, msg: '提问成功'});
          }
        )
      }
    ])
  })
}
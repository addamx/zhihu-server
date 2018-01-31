const model = require('../model');
const async = require('async');
const User = model.user;


module.exports = function(app) {
  app.post('/user/register', (req,res) => {
    console.log(req.body);
    const { name, pwd } = req.body;
    User.findOne({name}, (err, doc) => {
      if (doc) {
        return res.status(200).json({code:1, msg: '该用户名已被注册'});
      }
      const entity = new User({name, pwd});
      entity.save((err, doc) => {
        if (err || !doc) {
          return res.status(500).json({msg: '后端出错'});
        }
        const {name, type, _id} = doc;
        return res.status(200).json({code: 0, data: {name, id: _id}})
      })
    })
  })
  app.post('/user/info', (req,res) => {
    console.log(req.body);
    // const { id } = req.decoded;
    const { id } = req.body;
    User
      .findOne({_id: id})
      // .populate()
      .exec((err, doc) => {
        if (err) {
          return res.status(500).json({msg: '服务器出错'});
        }
        return res.json({ code: 0, data: doc })
      });
  });
}
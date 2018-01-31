const model = require('../model');
const async = require('async');
const jwt = require('jsonwebtoken');
const key = require('../config').privateKey;
const User = model.user;

module.exports = function(app) {
  app.post('/user/register', (req,res) => {
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
        const token = jwt.sign({ id: _id }, key, { expiresIn: 60 * 60 * 24 * 7 });
        return res.status(200).json({code: 0, token, data: {name, id: _id}});
      })
    })
  });
  app.post('/user/login', (req,res) => {
    const {name, pwd} = req.body;
    User.findOne({name, pwd}, {pwd: 0}, (err, doc) => {
      if (err) return res.status(500).json({msg: '后端出错'});
      if (!doc) return res.status(200).json({code: 1, msg: '用户名或密码错误'}); 
      const {name, _id} = doc;
      const token = jwt.sign({ id: _id }, key, { expiresIn: 60 * 60 * 24 * 7 });
      return res.status(200).json({code: 0, token, data: {name, id: _id}})
    })
  });
  app.post('/user/info', (req,res) => {
    const { id } = req.decoded;
    User
      .findOne({_id: id}, {pwd: 0})
      .populate({
        path: 'questions',
        options: { sort: {date: -1}}
      })
      .exec((err, doc) => {
        if (err) {
          return res.status(500).json({msg: '服务器出错'});
        }
        return res.json({ code: 0, data: doc })
      });
  });
}
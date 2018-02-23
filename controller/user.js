const model = require('../model');
const async = require('async');
const jwt = require('jsonwebtoken');
const key = require('../config').privateKey;
const User = model.user;

module.exports = function(app) {
  app.post('/user/register', (req,res) => {
    const { name, pwd } = req.body;
    if (!name || !pwd) return res.status(200).json({code: 1, msg: '请输入用户名和密码'}); 
    User.findOne({name}, (err, doc) => {
      if (doc) {
        return res.status(200).json({code:1, msg: '该用户名已被注册'});
      }
      const entity = new User({name, pwd, questions: [], answers: []});
      entity.save((err, doc) => {
        if (err || !doc) {
          return res.status(500).json({msg: '后端出错'});
        }
        const { name, _id,} = doc;
        const token = jwt.sign({ id: _id }, key, { expiresIn: 60 * 60 * 24 * 7 });
        return res.status(200).json({ code: 0, token, data: { name, _id}});
      })
    })
  });
  app.post('/user/login', (req,res) => {
    const {name, pwd} = req.body;
    if (!name || !pwd) return res.status(200).json({code: 1, msg: '请输入用户名和密码'}); 
    //!![TODO]如果不判空, name & pwd位undefined会返回所有;
    User.findOne({name, pwd}, {pwd: 0}, (err, doc) => {
      if (err) return res.status(500).json({msg: '后端出错'});
      if (!doc) return res.status(200).json({code: 1, msg: '用户名或密码错误'});
      const { name, _id} = doc;
      const token = jwt.sign({ id: _id }, key, { expiresIn: 60 * 60 * 24 * 7 });
      return res.status(200).json({ code: 0, token, data: { name, _id}})
    })
  });


  const getUser = (req, res, id) => {
    User
      .findOne({_id: id}, {pwd: 0})
      .populate({
        path: 'questions',
        options: { sort: {date: -1}},
        populate: {path: 'author', select: 'name'}
      })
      .populate({
        path: 'answers',
        options: { sort: {date: -1}},
        populate: {path: 'author', select: 'name'}
      })
      .populate({
        path: 'notices',
        options: { sort: { date: -1 } },
      })
      .exec((err, doc) => {
        if (err) {
          return res.status(500).json({msg: '服务器出错'});
        }
        return res.status(200).json({ code: 0, data: doc })
      });
  }
  app.get('/user/info/:id', (req,res) => {
    const id = req.params.id;
    getUser(req, res, id);
  });
  app.get('/user/auth', (req,res) => {
    const id = req.decoded.id;
    getUser(req, res, id);
  })
}
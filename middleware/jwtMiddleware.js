const jwt = require('jsonwebtoken')
const key = require('../config').privateKey;

module.exports = function(options) {
  return function(req,res,next) {

    const noAuthList = [
      '/question/allquestions',
      '/user/login',
      '/user/register'
    ];

    const noAuth = noAuthList.filter(el => el === req.url).length > 0;

    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (noAuth) {
      next()
    } else if (token) {
      jwt.verify(token, key, function(err, decoded) {
        if (err) {
          return res.status(401).json({ errorMsg: "token失效" });
        }
        req.decoded = decoded;
        next();
      });
    } else {
      return res.status(401).json({ errorMsg: "token失效" });
    }
  }
}
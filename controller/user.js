const model = require('../model');
const async = require('async');
const user = model.user;


module.exports = function(app) {
  app.get('/people/:name', (req,res) => {
    user
      .findOne({name: new RegExp(req.params.name, 'i')})
      .exec((err, doc) => {
        if (err) {
          return res.status(500).json({msg: '服务器出错'});
        }
        return res.json({ code: 0, data: doc })
      });
  });
}
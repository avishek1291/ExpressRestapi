var express = require('express');
var router = express.Router();
var dbapi=require('../data/dbtest').dbApi;
/* GET users listing. */
router.patch('/image/:id', function(req, res) {
  console.log("here user.js Get/ req.body -> ", req.body);   
  console.log("here user.js Get/ req.params -> ", req.params);   
  console.log("here user.js Get/ req.params.userid -> ", req.params.userid);   
  dbapi.updateEvent(req.params.userid,req,body, function(err, items) {
    res.json({users: items});  	
  });
});
router.patch('/file/:id', function(req, res) {
 console.log('inside routes of emailid')
  dbapi.updateEvent(req.params.email, function(err, items) {
    res.json(items);  	
  });
});
module.exports = router;

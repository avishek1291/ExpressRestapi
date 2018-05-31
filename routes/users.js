var express = require('express');
var router = express.Router();
var dbapi=require('../data/dbtest').dbApi;
var _=require('lodash');

/* GET users listing. */
/*
router.get('/:userid', function(req, res) {
  console.log("here user.js Get/ req.body -> ", req.body);   
  console.log("here user.js Get/ req.params -> ", req.params);   
  console.log("here user.js Get/ req.params.userid -> ", req.params.userid);   
  dbapi.getUserById(req.params.userid, function(err, items) {
    res.json({users: items});  	
  });
});
*/

router.get('/emailid/:email', function(req, res) {
  console.log('inside routes of emailid');
  dbapi.getUserByEmailId(req.params.email, function(err, items) {
    res.json(items);
  });
});

router.get('/host', function(req, res) {
  console.log('inside users.js get /hostuser');
  dbapi.getHostUser(function(err, hostUser) {
    res.json(hostUser);
  });
});

router.get('/evaluator', function(req, res) {
  console.log('inside users.js get /evaluatoruser');
  dbapi.getEvaluatorUser(function(err, evaluatorUsers) {
    res.json(evaluatorUsers);
  });
});

router.post('/adduser',function(req,res){
  console.log('this is user value in routes',req.body);
  dbapi.addUser(req.body,function(err,items){
    if(err) {
      throw new Error('email aleady exists')
      console.log('Document insert failed, err: ', err);
      // Duplicate username
      if (err.code === 11000) {
        return res.status(500).json({message: "User already exists, Duplicate key error index: emailid_1" });
      }

      //Some other error
      return res.status(500).json(err);
    }
    res.json(items);
    });
  })

router.get('/Home/:eventid/:name', function(req, res) {
  let result;
  console.log('inside routes of participant home')
  var participantName=req.params.name;
   dbapi.getEventbyId(req.params.eventid, function(err, item) {
    var teamList=item.TeamList
     result= _.find(teamList, _.flow(
      _.property('Participants'),
      _.partialRight(_.some, { emailid: participantName })
      
  ));
  console.log('this is result',typeof result)
    res.json(result);
   });
 });
module.exports = router;

var express =require('express');
var router=express.Router();
var dbapi=require('../data/dbtest').dbApi;
var fs=require('fs');
var mailApi=require('../data/mail_api');
var app=express();
/* get all vents */
var multer=require('multer');
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,req.params['teamName']+file.originalname);
    }
})
var upload=multer({storage:storage})

router.get('/getEvents',function(req,res,next){
console.log('reached the get events routes')
dbapi.getEvents(function(err,data){
    if(err){
        res.sendStatus(400);
        console.log('could no fetch')

    }
    else{
        res.json(data);
        console.log('response in route layer',data);
    }
})

});

router.get('/getTeamsbyEvent',function(req,res,next) {
    console.log('reached the getTeamsbyEvent routes')
    dbapi.getTeamsbyEvent(function(err,data){
        if(err) {
            console.log('could not fetch');    
        }
        else {
            res.json(data);
            console.log('response in route layer: ',data);
        }
    })
    
});

router.get('/getEvent/:id',function(request,response){
    console.log('by id routes',request.params['id']);
    dbapi.getEventbyId(request.params['id'],function(err,data){
        if(err){
            console.log('some error in by id')
        }
        else{
            response.json(data);
        }
    })
})

router.get('/getEvents/:hostname',function(request,response){
    console.log('by Hostname routes',request.params['hostname']);
    let hostname=request.params['hostname'];
    dbapi.getEventbyHost(hostname,function(err,data){
        if(err){
            console.log('some error in by id')
        }
        else{
            response.json(data);
        }
    })
})
router.post('/addEvent',function(request,response){
     console.log('reached the get events routes add',request.body);
     dbapi.addEvent(request.body,function(err,data){
        if(err){
            console.log('could no fetch')
    
       }
        else{
           response.json(data);
           console.log('response in route layer',data);
        }
     })
    console.log('iniside pot of events')
});
router.delete('/deleteEvent/:id',function(request,response){
    console.log('reached the get events routes delete',request.params.id);
    dbapi.deleteEvent(request.params.id ,function(err,data){
        if(err){
            console.log('could no fetch')
    
        }
        else{
            response.json(data);
            console.log('response in route layer',data);
        }
    })
});
router.get('/getEvaluateEvents/:evaluatorName',function(request,response){
    console.log('/getEvaluateEvents EvaluatorName: ',request.params['evaluatorName']);
    dbapi.getEventbyEvaluator(request.params.evaluatorName,function(err,data){
        if(err){
            console.log('Error: ', err);
        }
        else{
            response.json(data);
        }
    })
})
router.patch('/updateEvent/:id',function(request,response){
    console.log('reached the get events routes patch',request.body);
    dbapi.updateEvent(request.params.id,request.body,function(err,data){
        if(err){
            console.log('could no fetch')
    
        }
        else{
            //mailApi.sendmail(to,)
            response.json(data);
            console.log('response in route layer',data);
        }
    })
});
router.patch('/updateTeam/:id',function(request,response){
   console.log('reached the patch team routes ',JSON.stringify(request.body));
    //console.log('reached the get events routes id',request.params.id);
    dbapi.updateEventTeam(request.params.id,request.body,function(err,data){
        if(err){
            console.log('could no fetch')
        } else {
            response.json(data);
        }
    })
});

router.post('/SubmitIdea/:id/:teamName', upload.array("uploads[]", 12),function(request,response){
//    console.log('reached the patch idea routes, body: ',request.body);
//    console.log('reached the patch idea routes, files ',request.files);
//    console.log('Destination: ', request.files[0].destination);
//    console.log('Filename: ', request.files[0].filename);
    console.log('Path: ', request.files[0].path);
    dbapi.getEventbyId(request.params['id'],function(err,data) {
        if (err) {
            console.log('Error in SubmitIdea');
        } else {
            console.log('SubmitIdea GetEvent: ', data);
            for(var obj of data.TeamList) {
                if (obj.TeamName == request.params['teamName']) {
                  obj.SubmissionFilePath = request.files[0].path;
                  obj.FileName = request.files[0].filename;
                  obj.FileDestination = request.files[0].destination;
                }
              }
            dbapi.updateEventTeam(request.params['id'],data.TeamList,function(err,data){
                if(err) {
                    console.log('Error in SubmitIdea updateEventTeam', err);
                } else {
                    return response.status(200).json(data);
                }
            });
        }
    });
 });
///send mail 
router.get('/sendMail/:mailid',function(request,response){
    console.log('sendmail routes',request.params['mailid']);
   mailApi.sendmail(request.params['mailid']);
   response.end('mail sent sucessfully');
})

app.use(function(err,req,res,next){
console.log('inside error middleware');

if(err){
  res.end('invalid route')
}
})

// router.get('/fileDownload/:file(*)', function(req, res, next) { 
  /* router.get('/getFile/:id/:file(*)', function(req, res, next) { 
    var file = req.params.file;
    var path = require('path');
    var path = path.resolve(".") + '/uploads/' + file;
    res.download(path, file, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('downloading successful');
      }
    });
  });
*/
/*
 router.get('/getFile/:id/:teamName(*)', function(req, res, next) {

    dbapi.getEventbyId(request.params['id'],function(err,data) {
        if (err) {
            console.log('Error in GetFile getEventbyId err: ', err);
        } else {
            console.log('SubmitIdea GetEvent: ', data);
            for(var obj of data.TeamList) {
                if (obj.TeamName == request.params['teamName']) {
                  var filename = obj.FileName;
                  var filepath = obj.SubmissionFilePath;
                  var filedestination = obj.FileDestination;
                }
              }
        }
    });

//    var file = req.params.file;
    var path = require('path');
//    var path = path.resolve(".") + '/' + filepath;
    var path = path.resolve(filedestination) + '/' + filename;
    res.download(path, filename, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('downloading successful');
      }
    });
  });
*/

module.exports = router;
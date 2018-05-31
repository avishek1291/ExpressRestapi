var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var eventRoute=require('./routes/events');
var fileRoute=require('./routes/file')
var jwt=require('jsonwebtoken');
var app = express();
var ErrorHandler=require('./ErrorHandler/HackathonErrorHandler.js');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
 
  next();
});
// jwt verification middleware application level

app.get('/getToken/:emailid',function(req,res){  
  console.log('inside jwt sign in')
  var token=jwt.sign(req.params.emailid,'mysecretkey');
  var userobj={};
  userobj.emailid=req.params.emailid;
  userobj.token=token;
  res.json(userobj);
});
app.use('/', eventRoute);
app.use('/user', users);
app.use('/upload',fileRoute);
//catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('inside next err block')
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//custom middleware
app.use(ErrorHandler({option1: '1', option2: '2' }));
// error handler
app.use(function(err, req, res, next) {

  console.log('in error handler')
  // set locals, only providing error in development
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('invalid url')
 //res.render('error');
 //ErrorHandler.CustomErrorHandler(err,req,res);
  
});

module.exports = app;

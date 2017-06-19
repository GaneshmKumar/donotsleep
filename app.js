var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
var path = require('path');

var router = require('./routes/route')
var common  = require('./common/common');

var app = express();


console.log(app.get('env'));
if(app.get('env') == "production") {
	var accessLogStream = fs.createWriteStream(__dirname + '/logs/' + "logfile.log", {flags: 'a'});
    app.use(logger({stream: accessLogStream}));
}
else {
	app.use(logger('dev'));	
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);
app.use('/assets', express.static(__dirname + '/assets'));

const MONGO_URL = 'mongodb://127.0.0.1:27017/donotsleep'//process.env.MONGO_URL;


mongoose.connect(MONGO_URL, () => { console.log('Connected to MongoDB') });

const PORT = process.env.PORT || 1234
app.listen(PORT, () => { console.log(`Server running at ${PORT} ...`)} );	

//common.startAllJobs();

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  
  res.status(err.status || 500);
  if(err.status.toString() == '404')
  {
    res.sendFile(path.join(__dirname, 'assets/404.html'));  
  }
  else
  {
    res.end(err.status.toString());
  }
});

module.exports = app; 
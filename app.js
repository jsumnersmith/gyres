// bring in the node modules we're going to use
var express = require('express')
var http = require('http');
var path = require('path');
var routes = require('./routes');
var nunjucks = require('nunjucks');
var moment = require('moment');

// make the express app
var app = express();

// set up nunjucks
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/views'), {
  dev: true,
  autoescape: true
});

env.addFilter('log', function(data) {
  console.log(data);
});

env.addFilter('date', function(date, format) {
  var s = moment(date).format(format);
  return s;
});

// configure the app
app.configure( function(){
  env.express(app);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});



//  routes/index.js is where all the fun happens
app.get('/', routes.index);
app.get('/update', routes.update);

// run the server
http.createServer(app).listen(3000, function(){
  console.log('The node server is running at http://localhost:3000');
});

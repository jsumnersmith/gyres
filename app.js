// bring in the node modules we're going to use
var express     = require('express');
var http        = require('http');
var path        = require('path');
var fs          = require('fs');
var routes      = require('./routes');
var nunjucks    = require('nunjucks');
var moment      = require('moment');
var passport = require('passport');
// express 4.0 stuff
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var errorhandler = require('errorhandler');
var browserify = require('browserify');
var exposify = require('exposify');
//var angular = require('angular');

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
env.express(app);
app.set('views', __dirname + '/views');
//app.use(express.favicon()); //Need to replace it.
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.methodOverride());
//app.use(app.router);
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorhandler());

// app.use(session({ secret: 'thefoulragandboneshopoftheheart' })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

//  routes/index.js is where all the fun happens


// I want to remove all gui rendering from this app.
var router = express.Router();

app.get('/', routes.index);
app.get('/styles', routes.styleguide);
router.route('/projects/:type').get(routes.projects);
router.route('/projects/:type/:id')
  .get(routes.project)
  .put(routes.add);
//router.route('/users', routes.users);
router.route('/active/')
.get(routes.active);
router.route('/activate/:id')
.put(routes.activate);

//app.get('/', routes.index);
// app.get('/api/project/:type/:id', function() {}, routes.project);
// app.get('/api/projects/:type', routes.projects);
// app.get('/api/add/:type/:id', routes.add);

app.use('/api', router);


exposify.config = {angular: 'angular'};

var b = browserify({ cache: {}, packageCache: {}, fullPaths: true });
// var w = watchify(b, { 'opts.basedir': './public/js/modules/' });
// add our master _site file
b.add('./public/js/site.js');
// create the bundled file


function bundleAssets(cb) {
  b.transform(exposify);
  b.bundle( function(err, output) {
    if(err) {
      console.error('There was an issue running browserify!');
      console.error(err);
      return cb && callback(err);
    }

    // write our new file to the public/js folder
    fs.writeFile('./public/js/bundle.js', output, function (err) {
      if(err) {
        console.error('There was an error saving the freshly-bundled front end code.');
        console.error(err);
        return cb && callback(err);
      }
      console.log('Recompiled assets.');
      return cb && cb(null);
    });
  });
}

// b.on('update', function(ids) {
//   bundleAssets();
// });

bundleAssets();


// run the server
var port = 3000;
// Heroku
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  try {
    // Stagecoach option
    port = fs.readFileSync(__dirname + '/data/port', 'UTF-8').replace(/\s+$/, '');
  } catch (err) {
    console.log(err);
    console.log("I see no data/port file, defaulting to port " + port);
  }
}

http.createServer(app).listen(port, '127.0.0.1', function() {
  console.log("Express server listening on %s:%d in %s mode", '127.0.0.1', port, app.settings.env);
});

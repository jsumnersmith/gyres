// modules =================================================
var path            = require('path');
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var session         = require('express-session');
var mongoose        = require('mongoose');
var fs              = require('fs');
var browserify      = require('browserify');
var exposify        = require('exposify');
var passport        = require('passport');
var flash           = require('flash');

var routes      = require('./routes');
var Thirty7SignalsStrategy = require('passport-37signals').Strategy;
var errorhandler = require('errorhandler');
var browserify = require('browserify');
var exposify = require('exposify');

// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 3000;

// set our port
var port = process.env.PORT || 3000;

// N.B. We're using mongo now.
// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db.url);

//Bring in our passport config
require('./config/passport')(passport);

// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
// set the less middleware
app.use(require('less-middleware')(path.join(__dirname, 'public')));
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// required for passport
app.use(session({ secret: 'getitgotitgo' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(errorhandler());



//User Authentication Stuff
passport.serializeUser(function(user, callback) {

  callback(null, user);
});

passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
});

// routes ==================================================
require('./app/routes')(app, passport); // configure our routes


// //  routes/index.js is where all the fun happens
// // I want to remove all gui rendering from this app.
// var router = express.Router();

//All we need is an index & a styleguide.
app.get('/', routes.landing);
app.get('/styles', routes.styleguide);
app.get('/app',
  passport.authenticate('37signals', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.user);
    console.log("The profile is:", req.user._json.accounts);
    console.log("The accessToken is:", req.accessToken);
    return routes.index(req, res);
});

//Authentication Routes
app.get('/login',
  passport.authenticate('37signals'),
  function(req, res){
    // The request will be redirected to 37signals for authentication, so this
    // function will not be called.
  });

//router.route('/projects/:company').get(routes.projects);
//router.route('/project/:company/:id')
  //.get(passport.authenticate('37signals', { failureRedirect: '/login' }), routes.project)
  //.put(passport.authenticate('37signals', { failureRedirect: '/login' }), routes.add);
//router.route('/users', routes.users);
//router.route('/active/')
//.get(passport.authenticate('37signals', { failureRedirect: '/login' }), routes.active);
//router.route('/activate/:id')
//.put(passport.authenticate('37signals', { failureRedirect: '/login' }), routes.activate);

//app.use('/api', router);


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

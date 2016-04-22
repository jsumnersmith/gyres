var LocalStrategy   = require('passport-local').Strategy;
var users = require('../routes').users()

module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  // passport.serializeUser(function(user, callback) {
  //     callback(null, user.id);
  // });
  //
  // // used to deserialize the user
  // passport.deserializeUser(function(email, callback) {
  //     users.getUser(email, function(err, user) {
  //         callback(err, user);
  //     });
  // });


  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, callback) {
      process.nextTick(function() {
        users.getUser(email, , function(err, user) {
          // if there are any errors, return the error
          if (err){
            return done(callback);
          }
          if (user) {
              return callback(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            users.createUser({local: {email: email, password: password}}, function(err, user){
              console.log(chalk.green('[Gyres]')+'You made a user with the email address '+user.email);
              return callback(null, user);
            });
          }
        });
      });
    });
  );

  passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, callback) { // callback with email and password from our form
      users.getUser(email, function(err, user) {
        if (err){
          return callback(err);
        }
        if (!user){
          return callback(null, false, { message: 'Incorrect username.' });
        }
        if (!users.validPassword(user, password)){
          return callback(null, false, { message: 'Incorrect username.' });
        }
        return callback(null, user);
      });
    }));
  };



  //BC-Authentication
  passport.use(new Thirty7SignalsStrategy({
      clientID: config.credentials.basecamp.clientId,
      clientSecret: config.credentials.basecamp.clientSecret,
      callbackURL: "http://localhost:3000/app"
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        //console.log("At login, the profile is", profile);

        return routes.user(profile, accessToken, function(user){
          return done(null, user);
        })
      });
    }
  ));

}

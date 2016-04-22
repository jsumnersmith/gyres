

/* ---------------------------------------------------------------------------------------*/
//  This page is about passing info to app.js from projects.js (should that be my router?);
/* ---------------------------------------------------------------------------------------*/
var projects = require('./projects.js');
var users = require('./users.js');


module.exports = function(app, passport) {

  //Define all your routes here.
  // Make reference to lib as needed.

  //Project Stuff
  app.get('/api/projects', function(req, res){
    //list all projects for user.
  })
  app.get('/api/project', function(req, res){
    //list a project from a company of a user.
    // query options:
    //  - company
    //  - id
    //  - active (selected to track in gyres)
  })
  app.put('/api/project', function(req, res){
    //put a project from a company of a user.
  })

  //User Stuff
  app.get('/api/user', function(req, res){
    //get a user associated with a BC account
  })
  app.put('/api/user', function(req, res){
    //put a user based on their BC account
  })

  app.post('/api/login', function(){
    //log'em'in via BC
  });


}


exports.index = function(req, res){
  res.render('index.html');
};
exports.landing = function(req, res){
  res.render('landing.html');
};

exports.styleguide = function(req, res){
  res.render('styleguide.html');
};

exports.project = function(req, res){
  var project = {id: req.params.id, type: req.params.type};
  projects.getProject(req, res, project);
}

exports.projects = function(req, res){
  var company = req.params.company;
  projects.listAllProjects(req, res, company);
}

exports.add = function(req, res){
  var project = {id: req.params.id, type: req.params.type};
  projects.addProject(req, res, project);
}

exports.activate = function(req, res){
  var project = {id: req.params.id};
  projects.activateProject(req, res, project);
}

exports.active = function(req, res){
  projects.listActiveProjects(req, res);
}

exports.user = function(profile, token, callback){
  users.getUser(profile.id, function(err, user){
    console.log("The result of getting a user was", err, user);
  });

  // /console.log(user, token);
  console.log("Nice user, bro.");
  //Make sure to pass this into whatever subfunction you create.
  return callback(profile);
}

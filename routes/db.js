var levelup = require("level"),
    basecamp = require("./basecamp.js"),
    config = require("./../config.js"),
    _ = require('underscore');
var db = levelup('db/'+config.dbName, {'valueEncoding': 'json'});

var Data = {}

// Open this puppy up.
Data.getProject = function(project, callback){
  var projectId = project.type + project.id;
  return db.get(projectId, function(err, value){
    if(err) {
      console.log("Oops. Couldn't get the projects.", err);
    }
    return callback(value);
  })
};

Data.listAllProjects = function(company, callback){

  new basecamp.ListAllProjects({}, function(projects){
    return callback(projects);
  });

};

// A method for putting/updating projects in the db.
Data.putProject = function(project, putCallback){
  var projectId = project.type + project.id;
  if(project.type === ('basecamp' || 'Basecamp')){
    // This is where we make our External API call.
    new basecamp.PutProject(project.id, {}, function(project){
      console.log("The project is: ", project);
      return db.put(projectId, project, function(err){
        if(err) {
          console.log("Couldn't put:", projectId);
          console.log("Oops. Couldn't put the project", err);
        }
        return putCallback(null);
      })
    });
  } else if (project.type === ('github' || 'Github')){
    console.log('We are getting there');
    return putCallback(null);
  }
};

Data.activateProject = function(project, activateCallback){
  var projectId = project.type + project.id;
  var activeProjectsId = 'active' /* + user.id (when that's a thing)*/
  // Fetch the active projects array
  db.get(activeProjectsId, function(err, value){
    if(err) {
      console.log("Oops. Couldn't get the active projects.", err);
    }
    var activeArray;
    if (!value) {
      activeArray = [project];
    } else {
      console.log(value);
      value.push(project);
      activeArray = _.uniq(value);
      console.log(activeArray);
    }
    db.put(activeProjectsId, activeArray, function(err){
      if(err) {
        console.log("Couldn't activate:", project.id);
        console.log("Oops. Couldn't activate the project", err);
      }
      //Skipping a step here and getting the active project.
      return activateCallback(null);
    });
  });
};

Data.listActiveProjects = function(callback){
  var activeProjectsId = 'active' /* + user.id (when that's a thing)*/
  // Fetch the active projects array
  db.get(activeProjectsId, function(err, value){
    if(err) {
      console.log("Oops. Couldn't get the active projects.", err);
    }
    callback(value);
  });
};

Data.getUser = function(query, callback){
  return db.get(query.id, function(err, user){
    if(err) {
      console.log("Oops. Couldn't get the user.", err);
      return callback(err, null);
    }
    console.log("Inside the getUser method", user);
    return callback(null, user);
  });
}

Data.putUser = function(user, callback){
  return db.put(user.id, user, function(err){
    if(err) {
      console.log("Oops. Couldn't put the user.", err);
      return callback(err);
    }
    console.log("Inside the putUser method", user);
    return callback(null);
  });
}


exports.getProject = function(project, callback) {
  Data.getProject(project, callback);
}

exports.listAllProjects = function(company, callback){
  Data.listAllProjects(company, callback);
}

exports.putProject = function(project, callback) {
  Data.putProject(project, callback);
}

exports.activateProject = function(project, callback) {
  Data.activateProject(project, callback);
}

exports.listActiveProjects = function(callback){
  Data.listActiveProjects(callback);
}

exports.getUser = function(query, callback){
  Data.getUser(query, callback);
}

exports.putUser = function(user, callback){
  Data.putUser(user, callback);
}

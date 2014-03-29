var levelup = require("level"),
    BasecampProject = require("../routes/BasecampProject.js"),
    config = require("../config.js"),
    //projects = require("../routes/projects.js").array,
    async = require("async");

var db = levelup('db/'+config.dbName, {'keyEncoding': 'json'});

var Data = {}

// Open this puppy up.
Data.getProject = function(projectId, callback){
  return db.get(projectId, function(err, value){
    if(err) {
      console.log("Oops. Couldn't get the projects.", err);
    }
    console.log("Inside the getProject method", projectId);
    return callback(value);
  })
};

// A method for updating projects in the db.
Data.putProject = function(projectId, project, callback){
  return db.put(projectId, project, function(err){
    if(err) {
      console.log("Couldn't put:", projectId);
      console.log("Oops. Couldn't put the projects", err);
    }
    //console.log('Nice put!', projectId, project);
    return callback(null);
  })
};


exports.getProject = function(projectId, callback) {
  Data.getProject(projectId, callback);
}

exports.putProject = function(projectId, project, callback) {
  Data.putProject(projectId, project, callback);
}


// exports.setProjects = function(projectId) {
//   Data.setProjects(projectId);
// }
//
// exports.putProjects = function(projectId, callback) {
//   Data.putProjects(projectId, callback);
// }

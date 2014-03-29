// This file is about bringing all the projects into a single array;
var config = require("../config.js");
var async = require('async');
var BasecampProject = require("../routes/BasecampProject.js");
var data = require("../routes/db.js");
var app = require('../app.js');
//var io = require('socket.io').listen(app);

console.log("App is", app);
//console.log("Socket is", io);

// Instatiate the array
var projects = [];

var setProjectsData = function(setCallback) {
  return async.eachSeries(config.projects, function(project, innerSetCallback) {
    if (project.type === "basecamp" || project.type === "Basecamp") {

      var projectCallback = function(basecampProject){
        basecampProject.type = "basecamp";

        console.log('---------------------------------');
        console.log('Adding ' + project.title);
        console.log('---------------------------------');

        var projectString = JSON.stringify(basecampProject);
        data.putProject(project.id, projectString, function(){
          //console.log('Ready for your callback');
          return innerSetCallback();
        });
      };

      new BasecampProject.BasecampProject(project.id, {}, projectCallback);

    } else {
      console.log("Oops. Pardon our dust. Github isn't supported yet.");
    }
  }, function(){
      return setCallback();
  });
}

var getProjectsArray = function(outerArrayCallback) {
  projects = [];
  console.log(outerArrayCallback);
  async.forEachSeries(config.projects, function(project, projectsArrayCallback){
    if (project.type === "basecamp" || project.type === "Basecamp") {
      return data.getProject(project.id, function(result){
        var projectData = JSON.parse(result);
        console.log("I'm in the getProjectArray Method");
        projects.push(projectData);
        return projectsArrayCallback();
      });
    } else {
      console.log("Oops. Pardon our dust. Github isn't supported yet.");
      return projectsArrayCallback();
    }
  }, function(){
    console.log('Returning the old projects array');
    console.log(outerArrayCallback);
    return outerArrayCallback(projects);
  });
}

exports.getProjects = function(req, res) {
  getProjectsArray(function(projects) {
    res.render('index.html', {
      projects: projects
    });
  });
}

exports.setProjects = function(req, res){
  setProjectsData(function(){
    res.redirect('/');
  });
};

exports.array = projects;

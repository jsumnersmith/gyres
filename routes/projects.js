// This file is about bringing all the projects into a single array;
var config = require("../config.js");
var BasecampProject = require("../routes/BasecampProject.js");
var data = require("../routes/db.js");

// Instatiate the array
var projects = [];

var setProjectsData = function(res, setCallback) {
  config.projects.forEach(function(project) {
    if (project.type === "basecamp" || project.type === "Basecamp") {

      var projectCallback = function(basecampProject){
        basecampProject.type = "basecamp";
        console.log('---------------------------------');
        console.log('Adding ' + project.title);
        console.log('---------------------------------');
        //Now we should push them to the database
        var projectString = JSON.stringify(basecampProject);
        data.putProject(project.id, projectString, function(){
          getProjectsArray(res);
        });
        //projects.push(basecampProject);
      };

      var basecampProject = new BasecampProject.BasecampProject(project.id, {}, res, projectCallback);

    } else {
      console.log("Oops. Pardon our dust. Github isn't supported yet.");
    }
  });
  setCallback();
}

var getProjectsArray = function(res) {
  config.projects.forEach(function(project){
    if (project.type === "basecamp" || project.type === "Basecamp") {
      data.getProject(project.id, function(result){
        var projectData = JSON.parse(result);
        return projects.push(projectData);
      });
    } else {
      console.log("Oops. Pardon our dust. Github isn't supported yet.");
    }
  }, function(){
    res.send('OK');
    return projects;
  });
}

exports.getProjects = function(req, res) {
  getProjectsArray(res);
}

exports.setProjects = function(req, res){
  setProjectsData(res, function(){
    getProjectsArray(res);
  });
};

exports.array = projects;

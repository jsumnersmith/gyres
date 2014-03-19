// This file is about bringing all the projects into a single array;
var config = require("../config.js");
var BasecampProject = require("../routes/BasecampProject.js");
var data = require("../routes/db.js");

// Instatiate the array
var projects = [];

var setProjectsData = function(res) {
  config.projects.forEach(function(project) {
    if (project.type === "basecamp" || project.type === "Basecamp") {
      var basecampProject = new BasecampProject.BasecampProject(project.id, {}, res);
      basecampProject.type = "basecamp";
      console.log('---------------------------------');
      console.log('Adding ' + project.title);
      console.log('---------------------------------');
      //Now we should push them to the database;
      data.putProject(project.Id, JSON.stringify(basecampProject), function(res){res.send("Ok")});
      //projects.push(basecampProject);
    } else {
      console.log("Oops. Pardon our dust. Github isn't supported yet.");
    }
  });
  //res.send("Ok");
}

var getProjectsArray = function(res) {
  config.projects.forEachSeries(function(project){
    if (project.type === "basecamp" || project.type === "Basecamp") {
      var projectData = data.getProject(project.id, callback);
      var realProjectData = JSON.parse(projectData);
      console.log(realProjectData);
      projects.push(realProjectData);
    } else {
      console.log("Oops. Pardon our dust. Github isn't supported yet.");
    }
  }, res.send("Ok"));
}

exports.setProjects = function(req, res) {
  getProjectsArray(res);
}

exports.setProjects = function(req, res){
  setProjectsData(res);
};
exports.array = projects;

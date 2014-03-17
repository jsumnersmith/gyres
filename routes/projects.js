// This file is about bringing all the projects into a single array;
var config = require("../config.js");
var BasecampProject = require("../routes/BasecampProject.js");

// Instatiate the array
var projects = [];


var setProjectsArray = function(res) {
  config.projects.forEach(function(project) {
    if (project.type === "basecamp" || project.type === "Basecamp") {
      var basecampProject = new BasecampProject.BasecampProject(project.id, {}, res);
      basecampProject.type = "basecamp";
      console.log('---------------------------------');
      console.log('Adding ' + project.title);
      console.log('---------------------------------');
      console.log(basecampProject);
      projects.push(basecampProject);
    } else {
      console.log("Oops. Pardon our dust. Github isn't supported yet.");
    }
  });
  //res.send("Ok");
}


exports.setProjects = function(req, res){
  setProjectsArray(res);
};
exports.array = projects;



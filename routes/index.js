
/* ---------------------------------------------------------------*/
//  This page is about passing info to the templates
/* ---------------------------------------------------------------*/
var BasecampProject = require('../routes/basecampProject.js');
var projects = require('../routes/projects.js');


// Some instance specific stuff.
var title = "F&M Iteration";

exports.index = function(req, res){
  projects.getProjects(req, res);
};

exports.update = function(req, res, io) {
  projects.setProjects(req, res, io);
}

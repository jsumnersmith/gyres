/* ---------------------------------------------------------------------------------------*/
//  This page is about passing info to app.js from projects.js (should that be my router?);
/* ---------------------------------------------------------------------------------------*/
var projects = require('./projects.js');
//var users = require('./users.js');

exports.index = function(req, res){
  res.render('index.html');
};

exports.styleguide = function(req, res){
  res.render('styleguide.html');
};

exports.project = function(req, res){
  var project = {id: req.params.id, type: req.params.type};
  projects.getProject(req, res, project);
}

exports.projects = function(req, res){
  var type = req.params.type;
  projects.listAllProjects(req, res, type);
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

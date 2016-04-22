// This file is about bringing all the projects into a single array;
var config = require("./../config.js");
var db = require("./db.js");




//Get a single Project
function getProject(project, callback){
  db.getProject(project, function(result){
    callback(result);
  });
}

// //Get All Projects
function listAllProjects(company, callback){
  db.listAllProjects(company, function(results){
    callback(results);
  });
}

//Put a Project
function putProject(project, putCallback){
  console.log("In PutProject");
  return db.putProject(project, putCallback);
}

//Activate a Project
function activateProject(project, activateCallback){
  console.log("In activateProject");
  return db.activateProject(project, activateCallback);
}

function listActiveProjects(callback){
  db.listActiveProjects(function(results){
    callback(results);
  });
}

exports.getProject = function(req, res, project){
  return getProject(project, function(result){
    return res.json(result);
  });
}

exports.listAllProjects = function(req, res, company){
  return listAllProjects(company, function(results){
    return res.json(results);
  });
}

exports.addProject = function(req, res, project){
  return putProject(project, function(){
    res.send('Ok');
  });
}

exports.activateProject = function(req, res, project){
  return activateProject(project, function(){
    res.send('Ok');
  });
}

exports.listActiveProjects = function(req, res, type){
  return listActiveProjects(function(results){
    return res.json(results);
  });
}

var mongo = require("mongodb");
var BasecampProject = require('../routes/basecampProject.js');
var projects = require('../routes/projects.js');
//var db = require ('../routes/db.js');


/* -----------------------------------------------
  This page is about passing info to the templates
------------------------------------------------ */

// Some instance specific stuff.
var title = "F&M Iteration";

exports.index = function(req, res){
  res.render('index.html', {
    title: title,
    projects: projects.array,
  });
};

exports.update = function(req, res) {
  projects.setProjects(req, res);
  
}


// exports.update = function(req, res) {
//   db.update();
// };

// }

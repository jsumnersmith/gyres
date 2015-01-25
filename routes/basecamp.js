var _ = require('underscore');
var moment = require('moment');
var async = require('async');
var Basecamp = require('basecamp-classic');
var config = require('./../config.js');
var chalk = require('chalk');

var bc = new Basecamp(
  config.credentials.basecamp.url,
  config.credentials.basecamp.token
);

// Build out a prototype object for Basecamp Projects;
function PutProject(projectId, settings, projectCallback) {
  var self = this;
  self.id = projectId;
  self.settings = settings;
  self.project = {};
  self.init(projectCallback);
}

PutProject.prototype.init = function( projectCallback) {
  var self = this;
  console.log('['+chalk.yellow("Gyres")+']', chalk.green("Initializing sync with Basecamp."));

  // Let's fire of a series of functions.
  async.series([self.getMilestones.bind(self), self.getTodoLists.bind(self)], function(err){
    if(err){
      console.log('Oops. The whole show went down.', err);
    }
    if(!self.project.currentMilestone.todos || !self.project.currentMilestone.todos.length || !self.project.currentMilestone.completedTodos.length) {
      self.project.currentMilestone.progress = 0;
    } else {
      self.project.currentMilestone.progress = Math.floor(self.project.currentMilestone.completedTodos.length / (self.project.currentMilestone.todos.length)*100);
      console.log('['+chalk.yellow("Gyres")+']', chalk.red("Current progress is: " + self.project.currentMilestone.progress));

    }
    return projectCallback(self.project);
  });
};

PutProject.prototype.getMilestones = function(callback) {
  var self = this;
  console.log('['+chalk.yellow("Gyres")+']', chalk.blue("Gettings the milestones."));
  //console.log(self);
  // This goes off to BC to grab our Milestones.
  bc.milestones.fromProject(self.id, function(err, results){
    if(err){

      console.log(err);
      console.log("Oops. Didn't grab the milestones");
    } else {
      // With appropriate milestones in hand, let's add
      // them to the context.
      return self.setMilestones(results, callback);
    }
  });
};

PutProject.prototype.setMilestones = function(results, callback){
  var self = this;
  console.log('['+chalk.yellow("Gyres")+']', chalk.magenta("Setting the milestones."));
  // Re-order milestones based on deadline.
  var allMilestones = _(results).sortBy(function(milestone) {
    return milestone.deadline[0]._;
  });

  // Temporarily store upcoming milestones
  var upcomingMilestones = _.filter(allMilestones, function(milestone){
    return moment(milestone.deadline[0]._).add('days', 1).isAfter()
  });


  // Give us back the next milestone (the main iteration);
  // We're binding this to self to use as an object later-on.
  self.nextMilestone = _.find(upcomingMilestones, function(milestone){
    return milestone.completed[0]._ === "false";
  });

  console.log("I'm at least getting here.", self.nextMilestone);


  self.project.currentMilestone = {
    title: self.nextMilestone.title[0],
    dueDate: self.nextMilestone.deadline[0]._
  }

  console.log(self.project.currentMilestone);

  //Binding this to self since it's only used by the program.
  self.nextMilestoneId = self.nextMilestone.id[0]._;

  // Give us back the future milestones
  var futureMilestones = _.rest(upcomingMilestones, 0);

  self.project.openMilestones = futureMilestones.map(function(milestone){
    return {
      title: milestone.title[0],
      dueDate: milestone.deadline[0]._
    }
  });

  // Parse out the completed milestones
  var completedMilestones = _.filter(allMilestones, function(milestone){
    return milestone.completed[0]._ === "true";
  });


  self.project.completedMilestones = completedMilestones.map(function(milestone){
    return {
      title: milestone.title[0],
      completionDate: milestone.deadline[0]._
    }
  });

  // Now that we've got the milestones set, let's get the To-Dos
  return callback(null);
};

PutProject.prototype.getTodoLists = function(callback) {
  var self = this;

  console.log('['+chalk.yellow("Gyres")+']', chalk.red("Getting the associated to-dos."));
  bc.todoLists.fromProject(self.id, function(err, lists){
    if (err) {
      console.log("Oops. Couldnt' get lists for that one.");
    } else {
      return self.setTodoLists(lists, callback);
    }
  });
};

PutProject.prototype.setTodoLists = function(lists, callback) {
  var self = this;

  console.log('['+chalk.yellow("Gyres")+']', chalk.yellow("Setting the associated to-dos."));
  self.nextMilestoneLists = [];
  self.nextMilestoneLists = _.filter(lists, function(list){
    return list.milestoneId[0]._ === self.nextMilestoneId;
  });

  // What gets returned here? An array? A single Object?
  //console.log(self.nextMilestoneLists);

  // Now get Todos
  async.each(self.nextMilestoneLists, function(list, listCallback) {
    console.log('['+chalk.yellow("Gyres")+']', chalk.green('Going to get some to-dos'));
    self.getTodos(list, listCallback);
  }, function(){
    return callback(null);
  });
};

PutProject.prototype.getTodos = function(milestoneList, listCallback) {
  var self = this;

  //console.log("getTodos");
  self.project.currentMilestone.todos = [];
  self.project.currentMilestone.completedTodos = [];
  // TO-DO: set this after we've got all the to-dos.
  // project.currentMilestone.completedCount = '';
  return bc.todoItems.fromList(milestoneList.id[0]._, function(err, todos){
    if (err) {
      console.log("Oops. Couldn't find any to-dos");
      return listCallback(err);
    } else {
      return self.setTodos(todos, milestoneList, listCallback);
    }
  });
};

PutProject.prototype.setTodos = function(todos, milestoneList, listCallback) {
  var self = this;

 console.log('['+chalk.yellow("Gyres")+']', chalk.blue("Setting our Todos"));
  async.eachSeries(todos.todoItems.todoItem, function(item, todoCallback){
    //Build out our todo Object.

    var newTodoObject = {
      title: item.content[0],
      dueDate: item.dueAt[0]._,
      complete: item.completed[0]._,
      user: ((item.responsiblePartyId) ? item.responsiblePartyId[0]._ : '')
    };
    // Then send 'em out.
    if (item.completed[0]._ === "false") {
      console.log('['+chalk.yellow("Gyres")+']', "I'm pushing a current todo");

      self.project.currentMilestone.todos.push(newTodoObject);
    } else {
      console.log('['+chalk.yellow("Gyres")+']', "I'm pushing a complete todo");
      self.project.currentMilestone.completedTodos.push(newTodoObject);
    }
    return todoCallback(null);
  }, function(){
    console.log('['+chalk.yellow("Gyres")+']', chalk.magenta("All Finished Up"));
    return listCallback(null);
  });
};

// BasecampProject.prototype.getPerson = function(todo, todoInnerCallback) {
//   var self = this;

//   console.log("getPerson");
//   bc.people.load(todo.responsiblePartyId[0]._, function(err, person){
//     if (err) {
//       console.log("Oops, didn't find a person");
//     } else {
//       return self.setPerson(person, todo, todoInnerCallback);
//     }
//   });
// };

// BasecampProject.prototype.setPerson = function(person, todo, todoInnerCallback) {
//   console.log("setPerson");
//   todo.avatarUrl = person.person.avatarUrl;
//   console.log("Now call that callback");
//   return todoInnerCallback(null);
// };

function ListAllProjects(settings, projectCallback) {
  var self = this;
  self.settings = settings;
  self.projectList = [];
  self.init(projectCallback);
}

ListAllProjects.prototype.init = function(projectCallback) {
  var self = this;
  bc.projects.all(function(err, results){
    if (err) {
      console.log('['+chalk.red("Gyres")+']',"Oops. Couldnt' get the projects list.");
      callback(err);
    }
    return self.parseProjects(results, projectCallback);
  })
}

ListAllProjects.prototype.parseProjects = function(results, projectCallback) {
  var self = this;
  results.map(function(result){
    var project = {
      id: result.id[0]._,
      name: result.name[0],
      status: result.status[0]
    };
    console.log('['+chalk.yellow("Gyres")+']', "I'm parsing a project: ", project.name);
    return self.projectList.push(project);
  });
  return projectCallback(self.projectList);
}


module.exports = {
  PutProject: PutProject,
  ListAllProjects: ListAllProjects
};

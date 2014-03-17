var _ = require('underscore');
var moment = require('moment');
var async = require('async');
var Basecamp = require('basecamp-classic');
var config = require('../config.js');

var bc = new Basecamp(
  config.credentials.basecamp.url,
  config.credentials.basecamp.token
);

// Build out a prototype object for Basecamp Projects;
function BasecampProject(projectId, settings, res) {
  var self = this;
  self.id = projectId;
  self.settings = settings;
  self.init(res);
}

BasecampProject.prototype.init = function(res) {
  var self = this;
  console.log("init");

  // Let's fire of a series of functions.
  async.series([self.getMilestones.bind(self), self.getTodoLists.bind(self)], function(){
    self.nextMilestone.progress = Math.floor(self.nextMilestoneLists[0].completed.length / (self.nextMilestoneLists[0].todos.length + self.nextMilestoneLists[0].completed.length)*100);
    return res.send("Ok");
  });
  //self.getMilestones(res);
};

BasecampProject.prototype.getMilestones = function(callback) {
  var self = this;
  console.log("getMilestones");
  console.log(self);
  // This goes off to BC to grab our Milestones.
  bc.milestones.fromProject(self.id, function(err, results){
    if(err){
      console.log("Oops. Didn't grab the milestones");
    } else {
      // With appropriate milestones in hand, let's add
      // them to the context.
      return self.setMilestones(results, callback);
    }
  });
};

BasecampProject.prototype.setMilestones = function(results, callback){
  var self = this;
  console.log("setMilestones");
  // Re-order milestones based on deadline.
  self.allMilestones = _(results).sortBy(function(milestone) {
    return milestone.deadline[0]._;
  });

  // Temporarily store upcoming milestones
  var upcomingMilestones = _.filter(self.allMilestones, function(milestone){
    return moment(milestone.deadline[0]._).isAfter();
  });

  // Give us back the next milestone (the main iteration);
  self.nextMilestone = upcomingMilestones[0];

  self.nextMilestoneId = self.nextMilestone.id[0]._;

  // Give us back the future milestones
  self.futureMilestones = _.rest(upcomingMilestones, 0);

  // Parse out the completed milestones
  self.completedMilestones = _.filter(self.allMilestones, function(milestone){
    return milestone.completed[0]._ === "true";
  });

  // Now that we've got the milestones set, let's get the To-Dos
  console.log("Fire up that callback");
  return callback(null);
};

BasecampProject.prototype.getTodoLists = function(callback) {
  var self = this;

  console.log("getTodoLists");
  bc.todoLists.fromProject(self.id, function(err, lists){
    if (err) {
      console.log("Oops. Couldnt' get lists for that one.");
    } else {
      return self.setTodoLists(lists, callback);
    }
  });
};

BasecampProject.prototype.setTodoLists = function(lists, callback) {
  var self = this;

  console.log("setTodoLists");
  self.nextMilestoneLists = [];
  self.nextMilestoneLists = _.filter(lists, function(list){
    return list.milestoneId[0]._ === self.nextMilestoneId;
  });

  // Now get Todos
  async.eachSeries(self.nextMilestoneLists, function(list, listCallback) {
    console.log('Going to get some to-dos');
    self.getTodos(list, listCallback);
  }, function(){
    console.log("Finished up with getting the to-do lists");
    return callback(null);
  });
};

BasecampProject.prototype.getTodos = function(milestoneList, listCallback) {
  var self = this;

  console.log("getTodos");
  milestoneList.todos = [];
  milestoneList.completed = [];
  return bc.todoItems.fromList(milestoneList.id[0]._, function(err, todos){
    if (err) {
      console.log("Oops. Couldn't find any to-dos");
      return listCallback(err);
    } else {
      return self.setTodos(todos, milestoneList, listCallback);
    }
  });
};

BasecampProject.prototype.setTodos = function(todos, milestoneList, listCallback) {
  var self = this;
  // console.log('Res is here:');
  // console.log(res);
  // var todosFinished = function(res) {
  //   console.log("Res is also here:");
  //   console.log(res);
  //
  //   res.send("Ok");
  // }

  console.log("setTodos");
  async.eachSeries(todos.todoItems.todoItem, function(item, todoCallback){
    console.log("I'm at least starting.");
    async.series([
      function(todoInnerCallback){
        if(item.responsiblePartyId){
          console.log("There was a person!");
          self.getPerson(item, todoInnerCallback);
        } else {
          todoInnerCallback(null);
        }
      },
      function(todoInnerCallback) {
        // Then send 'em out.
        if (item.completed[0]._ === "false") {
          console.log("I'm pushing that array");
          milestoneList.todos.push(item);
        } else {
          console.log("I'm pushing that other array");
          milestoneList.completed.push(item);
        }
        console.log("Calling that inner todo callback, Baby.");
        return todoInnerCallback(null);
      }
    ], function(){
      console.log('Calling that to-do callback, buddy');
      return todoCallback(null);
    });
  }, function(){
    console.log("All Done!");
    return listCallback(null);
  });


};

BasecampProject.prototype.getPerson = function(todo, todoInnerCallback) {
  var self = this;

  console.log("getPerson");
  bc.people.load(todo.responsiblePartyId[0]._, function(err, person){
    if (err) {
      console.log("Oops, didn't find a person");
    } else {
      return self.setPerson(person, todo, todoInnerCallback);
    }
  });
};

BasecampProject.prototype.setPerson = function(person, todo, todoInnerCallback) {
  console.log("setPerson");
  todo.avatarUrl = person.person.avatarUrl;
  console.log("Now call that callback");
  return todoInnerCallback(null);
};


module.exports = {
  BasecampProject: BasecampProject,
};

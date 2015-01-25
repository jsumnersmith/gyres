var $ = require('jquery');
var _ = require('underscore');
var moment = require('moment');


module.exports.init = function(){

  console.log('Hello');

  var ToggleMenu = function(){
    var $body = $('body'),
        $toggle = $('[data-toggle-menu]');

    $toggle.click(function(e){
      e.preventDefault();
      $body.toggleClass('nav');
    })
  }

  // var LoadProjects = function(){
  //   getProjects('basecamp', function(data){
  //     buildProjectList(data);
  //   })
  // }
  //
  // var UpdateProjects = function(){
  //   $refresh = $('[data-refresh-projects]');
  //   $refresh.click(function(e){
  //     e.preventDefault();
  //     //console.log('Please Refresh');
  //     getProjects('basecamp', function(data){
  //       buildProjectList(data);
  //     })
  //   })
  // }
  //
  // var loadProject = function(type, id){
  //   putProject(type, id, function(){
  //     getProject(type, id, function(data){
  //       console.log("I'm about to build");
  //       buildProject(data);
  //     })
  //   })
  // }
  //
  //
  // function getProjects(type, callback){
  //   $.get('http://localhost:3000/api/projects/'+type,
  //     {},
  //     function(data){
  //       callback(data);
  //     },
  //     'json'
  //   );
  // }
  //
  // function getProject(type, id, callback){
  //   $.get('http://localhost:3000/api/projects/'+type+'/'+id,
  //     {},
  //     function(data){
  //       callback(data);
  //     },
  //     'json'
  //   );
  // }
  //
  // function putProject(type, id, callback){
  //   $.ajax({
  //     url: 'http://localhost:3000/api/projects/'+type+'/'+id,
  //     type: 'PUT',
  //     success: function(data){
  //       callback(data);
  //     },
  //   });
  // }
  //
  // function buildProjectList(data){
  //   var $list = $('[data-project-list]'),
  //       $template = $('[data-project-template]');
  //   _.each(data, function(project){
  //     if (project.status === "archived"){
  //       return false;
  //     }
  //     var $project = $template.clone();
  //     $project.removeAttr('data-project-template')
  //             .find('a').text(project.name)
  //                       .data('project-id', project.id);
  //     $project.click(function(e){
  //       e.preventDefault();
  //       loadProject('basecamp', project.id);
  //     });
  //     $list.append($project);
  //   });
  //   $template.hide();
  // }
  //
  // function buildProject(data){
  //   console.log("I'm building...");
  //   $template = $('[data-gyres]');
  //   $project = $template.clone();
  //   $project.removeClass('template');
  //
  //   var $currentList = $project.find('[data-current-list]'),
  //       $completedLists = $project.find('[data-completed-lists]'),
  //       $futureLists = $project.find('data-future-lists'),
  //       $openTodos = $currentList.find('[data-open-todos]'),
  //       $closedTodos = $currentList.find('[data-closed-todos]');
  //
  //   // Setup the current list.
  //   $project.find('[data-current-title]').text(data.currentMilestone.title);
  //   $project.find('[data-current-deadline]').text(moment(data.currentMilestone).format('MM/DD/YY'));
  //
  //   // Setup the current todos
  //   _.each(data.currentMilestone.todos, function(todo){
  //     $openTodos.append('<li class="open">'+todo.title+'</li>');
  //   });
  //
  //   // Setup the completed todos
  //   _.each(data.currentMilestone.completedTodos, function(todo){
  //     $openTodos.append('<li class="complete">'+todo.title+'</li>');
  //   });
  //
  //   $('.main').append($project);
  // }

  $(document).ready(function(){
    // window.update = new Update();
    window.toggleMenu = new ToggleMenu();
    // window.updateProjects = new UpdateProjects();
    // window.loadProjects = new LoadProjects();
  })
}

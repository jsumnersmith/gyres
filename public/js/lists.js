var $ = require('jquery');
var _ = require('underscore');
var moment = require('moment');
//var angular = require('./vendor/angular.min.js');

// function getProjects(type, callback){
//   console.log("I am getting");
//   $.get('http://localhost:3000/api/projects/'+type,
//     {},
//     function(data){
//       callback(data);
//     },
//     'json'
//   );
// }

module.exports.init = function(){

  var app = angular.module('gyres', []);

  app.controller('Projects', function Projects($scope, $http){
    $http.get('api/projects/basecamp').success(function(data) {
      $scope.projects = data;
    });

    function putProject(project){
      $http.put('api/projects/basecamp/'+project.id).success(function(data){
        $scope.setProject(project);
      })
    }

    $scope.setProject = function(project){
      $http.get('api/projects/basecamp/'+project.id).success(function(data){
        if (!data){
          return putProject(project);
        }
        $('.base').toggleClass('template', false);
        $scope.project = data;
        $scope.project.title = project.name;
        console.log($scope.project);
      }).error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("Didn't get anything.");
      });
    }
  });

  // app.controller('ProjectController', function ProjectController($scope){
  //
  // })


  // list.on('update-list', function(e){
  //   getProjects('basecamp', function(projects){
  //     var data = {};
  //     data.projects = projects;
  //     list.set({data: data});
  //   });
  // });
  //
  // $(document).ready(function(){
  //   getProjects('basecamp', function(projects){
  //     var data = {};
  //     data.projects = projects;
  //     // console.log(data);
  //     // list.set({data: data});
  //     var list = new Ractive({
  //       el: '.offcanvas-list',
  //       template: listTemplate,
  //       data: data
  //     });
  //   });
  // })
}

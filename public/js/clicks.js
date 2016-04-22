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

  $(document).ready(function(){
    // window.update = new Update();
    window.toggleMenu = new ToggleMenu();
    // window.updateProjects = new UpdateProjects();
    // window.loadProjects = new LoadProjects();
  })
}

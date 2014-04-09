//var socket = new io.Socket(null, {port: 3000});

var Update = function() {
  var $refresher = $("#refresh");

  console.log($refresher.length);

  var ajaxUpdate = function() {
    $.ajax({
      method: 'GET',
      url: "/update",
      context: document.body,
      success: function(){
        console.log("success");
        //console.log(event);
        $('body').toggleClass('loading', false);
        window.location.reload(true);
      }
    });
  }

  $refresher.click(function(){
    $('body').toggleClass('loading', true);
    ajaxUpdate();
  });

  window.setInterval(function(){
    ajaxUpdate();
  }, 300000);

}

$(document).ready(function(){
  window.update = new Update();
})

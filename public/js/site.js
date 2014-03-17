var Update = function() {
  var $refresher = $("#refresh");

  console.log($refresher.length);

  $refresher.click(function(){
    $('body').toggleClass('loading', true);
    $.ajax({
      method: 'GET',
      url: "/update",
      context: document.body,
      success: function(){
        console.log("success");
        $('body').toggleClass('loading', false);
        window.location.reload(true);
      }
    })
  })
}

$(document).ready(function(){
  window.update = new Update();
})

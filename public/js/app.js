define([
  'backbone-marionette',
  'router'
], function(Backbone, Router){

  var init = function(){
    var router = new Router();
    Backbone.history.start({pushState: true});
  };

  return {init: init};

});

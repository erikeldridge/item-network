define([
  'backbone'
], function(Backbone){
  var Model = Backbone.Model.extend({
    urlRoot: '/api/1/user_likes'
  });
  return Model;
});

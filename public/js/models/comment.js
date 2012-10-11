define([
  'backbone'
], function(Backbone){
  var Model = Backbone.Model.extend({
    urlRoot: '/api/1/comment'
  });
  return Model;
});

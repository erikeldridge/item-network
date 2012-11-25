define([
  'backbone'
], function(Backbone){
  var Model = Backbone.Model.extend({
    idAttribute: 'user_id'
  });
  return Model;
});

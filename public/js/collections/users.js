define([
  'backbone',
  'models/user'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model,
    url: '/api/1/users'
  });
  return new Collection(init.users);
});

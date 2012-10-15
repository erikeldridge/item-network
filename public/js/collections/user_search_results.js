define([
  'backbone',
  'models/user'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/users'
  });
  return new Collection(init.users);
});

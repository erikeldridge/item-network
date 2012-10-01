define([
  'backbone',
  'models/user'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model
  });
  return new Collection(init.users);
});

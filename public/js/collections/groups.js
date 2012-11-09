define([
  'backbone',
  'models/group'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model,
    url: '/api/1/groups'
  });
  return new Collection(init.groups);
});

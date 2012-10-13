define([
  'backbone',
  'models/activity'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/activity'
  });
  return new Collection(init.activities);
});

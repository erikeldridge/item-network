define([
  'backbone',
  'models/activity'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model
  });
  return new Collection(init.activities);
});

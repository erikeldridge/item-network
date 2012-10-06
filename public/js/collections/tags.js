define([
  'backbone',
  'models/tag'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model
  });
  return new Collection(init.tags);
});

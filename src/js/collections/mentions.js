define([
  'backbone',
  'models/mention'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model
  });
  return new Collection(init.mentions);
});

define([
  'backbone',
  'models/item'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model
  });
  return new Collection(init.items);
});

define([
  'backbone',
  'models/item'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model,
    url: '/api/1/items'
  });
  return new Collection(init.items);
});

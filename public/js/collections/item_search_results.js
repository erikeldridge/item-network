define([
  'backbone',
  'models/item'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/items'
  });
  return new Collection(init.items);
});

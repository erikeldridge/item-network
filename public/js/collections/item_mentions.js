define([
  'backbone',
  'models/item_mention'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model
  });
  return new Collection(init.item_mentions);
});

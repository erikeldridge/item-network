define([
  'backbone',
  'models/item_comment'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/item_comments'
  });
  return new Collection(init.item_comments);
});

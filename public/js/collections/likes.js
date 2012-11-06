define([
  'backbone',
  'models/like'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/likes'
  });
  return new Collection(init.likes);
});

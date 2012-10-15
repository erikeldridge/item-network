define([
  'backbone',
  'models/comment'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/comments'
  });
  return new Collection(init.comments);
});

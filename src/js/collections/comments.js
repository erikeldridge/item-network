define([
  'backbone',
  'models/comment'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model,
    url: '/api/1/comments'
  });
  return new Collection(init.comments);
});

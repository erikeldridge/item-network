define([
  'backbone',
  'models/comment_tag'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/comment_tags'
  });
  return new Collection(init.comment_tags);
});

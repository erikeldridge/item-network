define([
  'backbone',
  'models/comment_tag'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model
  });
  return new Collection(init.comment_tags);
});

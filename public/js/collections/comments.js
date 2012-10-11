define([
  'backbone',
  'models/comment'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model
  });
  return new Collection(init.comments);
});

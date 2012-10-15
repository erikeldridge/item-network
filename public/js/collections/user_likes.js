define([
  'backbone',
  'models/user_like'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/user_likes'
  });
  return new Collection(init.user_likes);
});

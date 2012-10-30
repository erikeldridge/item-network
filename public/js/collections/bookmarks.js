define([
  'backbone',
  'models/bookmark'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/bookmarks'
  });
  return new Collection(init.bookmarks);
});

define([
  'backbone'
], function(Backbone){
  var Model = Backbone.Model.extend({
    urlRoot: '/api/1/item_mentions',
  });
  return Model;
});

define([
  'backbone',
  'models/contributor'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model,
    url: '/api/1/contributors'
  });
  return new Collection(init.contributors);
});

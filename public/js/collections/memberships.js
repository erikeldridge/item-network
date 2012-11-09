define([
  'backbone',
  'models/membership'
], function(Backbone, model){
  var Collection = Backbone.Collection.extend({
    model: model,
    url: '/api/1/memberships'
  });
  return new Collection(init.memberships);
});

define([
  'backbone',
  'models/session'
], function(Backbone, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,
    url: '/api/1/session'
  });
  var sessions = new Collection(init.current_user);
  return sessions;
});

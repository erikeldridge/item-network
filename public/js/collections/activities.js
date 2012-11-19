define([
  'backbone', 'collections/likes', 'collections/comments'
], function(Backbone, likeCollection, commentCollection){

  var collections = {},
      model = Backbone.Model.extend({
        idAttribute: "model_id"
      }),
      Collection = Backbone.Collection.extend({
        url: '/api/1/activities',
        model: model,
        parse: function(resp){
          var activities = [];
          _.each(resp.likes, function(like){
            likeCollection.add(like);
            like.model_id = 'like-'+like.id;
            activities.push(like);
          });
          _.each(resp.comments, function(comment){
            commentCollection.add(comment);
            comment.model_id = 'comment-'+comment.id;
            activities.push(comment);
          });
          return activities;
        },
        comparator: function(model) {
          return model.get("created_at");
        }
      });

  return {
    get: function(name){
      var collection = collections[name];
      if(!collection){
        collection = collections[name] = new Collection();
        collection.reset( collection.parse(init.activities[name] || {}) );
      }
      return collection;
    }
  };
});

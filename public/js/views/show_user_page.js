define([
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/user_likes',
  'text!templates/show_user_page.html'
], function module(_, Backbone, userCollection, commentCollection, userLikesCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'click .btn': 'like'
    },
    like: function(e){
      var like = {
        user_id: this.user.get('id')
      };
      userLikesCollection.on('sync', function(model){
        var $btn = $(e.currentTarget);
        $btn.addClass('btn-success');
        $btn.find('i').addClass('icon-white');
      }, this);
      userLikesCollection.create(like);
    },
    initialize: function(options){
      var id = options.params[0];
      this.user = userCollection.get(id);
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
            user: this.user,
            comments: commentCollection.where({owner_id:this.user.get('id')}),
            isLiked: userLikesCollection.where({user_id:this.user.get('id'), owner_id:1}).length > 0 // HACK: current user
          });
      this.$el.html( html );
    }
  });
  return View;

});

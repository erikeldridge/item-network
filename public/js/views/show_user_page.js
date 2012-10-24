define([
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/user_likes',
  'collections/comment_search_results',
  'views/comment',
  'views/comment_form',
  'views/stream',
  'text!templates/show_user_page.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone,
  userCollection, commentCollection, userLikesCollection, commentSearchResultCollection,
  CommentView, CommentFormView, StreamView,
  showUserPageTemplate, commentSearchResultsTemplate){

  var View = Backbone.View.extend({
    template: _.template( showUserPageTemplate ),
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
            isLiked: userLikesCollection.where({user_id:this.user.get('id'), owner_id:1}).length > 0 // HACK: current user
          }),
          comments = commentCollection.where({owner_id:this.user.get('id')});
      this.$el.html( html );
      // comment form
      var commentForm = new CommentFormView();
      this.on('remove', commentForm.remove);
      this.$('.comment-form').append(commentForm.el);
      // comment stream
      comments = commentCollection.where({
        owner_id: this.user.get('id')
      });
      commentSearchResultCollection.reset(comments);
      commentSearchResultCollection.fetch({
        data: 'owner_id='+this.user.get('id')
      });
      commentStream = new StreamView({
        template: commentSearchResultsTemplate,
        collection: commentSearchResultCollection
      });
      this.on('remove', commentStream.remove);
      this.$('.comment-stream').html(commentStream.render().el);
    }
  });
  return View;

});

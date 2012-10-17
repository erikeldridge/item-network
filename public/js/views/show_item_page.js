define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/comments',
  'views/comment',
  'views/comment_form',
  'text!templates/show_item_page.html'
], function module(_, Backbone,
  itemCollection, commentCollection,
  CommentView, CommentFormView,
  template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(options){
      var id = options.params[0];
      this.item = itemCollection.get(id);
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
            item: this.item
          }),
          comments = commentCollection.toArray();
      this.$el.html( html );
      // comment form
      var commentForm = new CommentFormView();
      this.on('remove', commentForm.remove);
      this.$('.comment-form').append(commentForm.el);
      // comment stream
      commentCollection.on('add', function(comment){
        var view = new CommentView({
          comment: comment
        });
        this.on('remove', view.remove);
        this.$('.comment-stream').append(view.el);
      }, this);
      _.each(comments, function(comment){
        var view = new CommentView({
          comment: comment
        });
        this.on('remove', view.remove);
        this.$('.comment-stream').append(view.el);
      }, this);
    }
  });
  return View;

});

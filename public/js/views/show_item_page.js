define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/item_comments',
  'collections/comment_search_results',
  'views/comment',
  'views/comment_form',
  'views/stream',
  'text!templates/show_item_page.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone,
  itemCollection, commentCollection, commentSearchResultCollection,
  CommentView, CommentFormView, StreamView,
  template, commentSearchResultsTemplate){

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
          commentForm = new CommentFormView(),
          name = this.item.get('name'),
          re = new RegExp(name),
          comments,
          commentStream;

      this.$el.html( html );

      // comment form
      this.on('remove', commentForm.remove);
      this.$('.comment-form').append(commentForm.el);
      // comment stream
      commentStream = new StreamView({
        template: commentSearchResultsTemplate,
        collection: commentCollection
      });
      this.on('remove', commentStream.remove);
      this.$('.comment-stream').html(commentStream.render().el);
    }
  });
  return View;

});

define([
  'underscore',
  'backbone',
  'collections/comments',
  'collections/items',
  'collections/users',
  'collections/comment_tags',
  'collections/activities',
  'views/comment_tag_form',
  'views/stream',
  'text!templates/show_comment_page.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone,
  commentCollection, itemCollection, userCollection, tagCollection, activityCollection,
  CommentTagFormView, StreamView,
  pageTemplate, streamTemplate){

  var View = Backbone.View.extend({
    template: _.template( pageTemplate ),
    events: {
      'submit form': 'createComment'
    },
    createComment: function(){
      var $input = this.$('input'),
          comment = {
            text: $input.val(),
            reply_to_id: this.comment.get('id')
          },
          opts = {
            success: function(comment){
              $input.val('');
              activityCollection.fetch(); // activity created server-side; pull in latest
            },
            wait: true
          };
      commentCollection.create(comment, opts);
      return false;
    },
    initialize: function(options){
      var id = options.params[0];
      this.comment = commentCollection.get(id);
      this.render();
    },
    remove: function(){
      this.trigger('remove');
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var text = this.comment.get('text'),
          itemIds = text.match(/{item-(\d+)}/) || [],
          userIds = text.match(/{user-(\d+)}/) || [];
      text = text.replace(/{([^-]+-\d+)}/g, '<a data-model-id="$1"></a>');
      itemIds.shift();
      userIds.shift();
      var that = this,
          html = this.template({
            comment: this.comment,
            text: text
          }),
          stream = new StreamView({
            template: streamTemplate,
            collection: commentCollection,
            filter: function(comment){
              return comment.get('reply_to_id') === that.comment.get('id');
            }
          });
      this.$el.html( html );
      this.$('.comment-stream').html(stream.render().el);
      this.on('remove', stream.remove);
    }
  });
  return View;

});

define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/comments',
  'collections/activities',
  'views/comment',
  'views/comment_form',
  'views/stream',
  'views/typeahead/input',
  'text!templates/show_item_page.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone,
  itemCollection, commentCollection, activityCollection,
  CommentView, CommentFormView, StreamView, TypeaheadInputView,
  template, commentSearchResultsTemplate){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'comment'
    },
    comment: function(){
      var $input = this.$('input'),
          comment = {
            text: $input.val(),
            item_id: this.item.get('id')
          },
          opts = {
            success: function(comment){
              $input.val('');
              activityCollection.fetch(); // activity created server-side; pull in latest
            }
          };
      commentCollection.create(comment, opts);
      return false;
    },
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
          that = this,
          commentStream;

      this.$el.html( html );

      // comment stream
      commentStream = new StreamView({
        template: commentSearchResultsTemplate,
        collection: commentCollection,
        filter: function(comment){return comment.get('item_id') === that.item.get('id')}
      });
      this.on('remove', commentStream.remove);
      this.$('.comment-stream').html(commentStream.render().el);
    }
  });
  return View;

});

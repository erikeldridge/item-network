define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/item_comments',
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
      'submit form': 'save'
    },
    save: function(){
      var $input = this.$('input'),
          comment = {
            text: $input.val()
          },
          opts = {
            success: function(){
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
          commentStream;

      this.$el.html( html );

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

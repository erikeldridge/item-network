define([
  'underscore',
  'backbone',
  'current_user',
  'collections/items',
  'collections/comments',
  'collections/activities',
  'views/comment',
  'views/comment_form',
  'views/stream',
  'views/typeahead/input',
  'text!templates/show_item_page.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone, currentUser,
  itemCollection, commentCollection, activityCollection,
  CommentView, CommentFormView, StreamView, TypeaheadInputView,
  template, commentSearchResultsTemplate){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'comment',
      'click h1.editable': 'editName',
      'blur input[data-field="name"]': 'saveName',
    },
    editName: function(e){
      var $el = $(e.target),
          name = $el.text().replace(/^\s+|\s+$/, ''),
          $input = $('<input type="text" value="'+name+'" data-field="name">');
      $el.replaceWith($input);
      $input.focus();
    },
    saveName: function(e){
      var $input = $(e.target),
          name = $input.val().replace(/^\s+|\s+$/, ''),
          $el = $('<h1 class="editable">'+name+'</h1>');
      this.item.set('name', name).save();
      $input.replaceWith($el);
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
            currentUserIsOwner: this.item.get('owner_id') === currentUser.user_id,
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

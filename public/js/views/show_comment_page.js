define([
  'underscore',
  'backbone',
  'current_user',
  'collections/comments',
  'collections/items',
  'collections/users',
  'collections/comment_tags',
  'collections/activities',
  'views/comment_tag_form',
  'views/stream',
  'views/typeahead/input',
  'text!templates/show_comment_page.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone, currentUser,
  commentCollection, itemCollection, userCollection, tagCollection, activityCollection,
  CommentTagFormView, StreamView, TypeaheadInputView,
  pageTemplate, streamTemplate){

  var View = Backbone.View.extend({
    template: _.template( pageTemplate ),
    events: {
      'click h1.editable': 'editText',
      'blur input[data-field="text"]': 'saveText',
      'click .destroy': 'destroyItem'
    },
    destroyItem: function(){
      this.comment.destroy();
      this.comment.on('sync', function(){
        Backbone.history.navigate('/comments', {trigger: true});
        activityCollection.fetch();
      });
      this.remove();
    },
    editText: function(e){
      var $el = $(e.target),
          text = $el.text().replace(/^\s+|\s+$/, ''),
          $input = $('<input type="text" value="'+text+'" data-field="text">');
      $el.replaceWith($input);
      $input.focus();
    },
    saveText: function(e){
      var $input = $(e.target),
          text = $input.val().replace(/^\s+|\s+$/, ''),
          $el = $('<h1 class="editable">'+text+'</h1>');
      this.comment.save('text', text);
      $input.replaceWith($el);
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
      var that = this,
          html = this.template({
            currentUserIsOwner: this.comment.get('owner_id') === currentUser.user_id,
            comment: this.comment
          }),
          stream = new StreamView({
            template: streamTemplate,
            collection: commentCollection,
            filter: function(comment){
              return comment.get('reply_to_id') === that.comment.get('id');
            }
          }),
          input = new TypeaheadInputView({
            comment: {
              reply_to_id: this.comment.get('id')
            }
          });
      this.$el.html( html );

      this.$('.typeahead').html(input.render().el);
      this.$('.comment-stream').html(stream.render().el);
      this.on('remove', input.remove);
      this.on('remove', stream.remove);
    }
  });
  return View;

});

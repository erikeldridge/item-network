define([
  'zepto',
  'underscore',
  'backbone',
  'current_user',
  'collections/items',
  'collections/users',
  'collections/comments',
  'collections/activities',
  'views/layout',
  'views/comment',
  'views/comment_form',
  'views/stream',
  'views/typeahead/input',
  'text!templates/show_item_page.html',
  'text!templates/comment_search_results.html'
], function module($, _, Backbone, currentUser,
  itemCollection, userCollection, commentCollection, activityCollection,
  LayoutView, CommentView, CommentFormView, StreamView, TypeaheadInputView,
  template, commentSearchResultsTemplate){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'click h1.editable': 'editName',
      'blur input[data-field="name"]': 'saveName',
      'click .destroy': 'destroyItem'
    },
    destroyItem: function(){
      this.item.destroy();
      this.item.on('sync', function(){
        Backbone.history.navigate('/items', {trigger: true});
        activityCollection.fetch();
      });
      this.remove();
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
      this.item.save('name', name);
      $input.replaceWith($el);
    },
    initialize: function(options){
      var id = options.params[0];
      this.item = itemCollection.get(id);
      this.render();
    },
    remove: function(){
      this.trigger('remove');
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var page = this.template({
            currentUserIsOwner: this.item.get('owner_id') === currentUser.user_id,
            item: this.item
          }),
          that = this,
          commentStream;

      var layout = new LayoutView({
        page: page
      });
      this.on('remove', layout.remove);
      this.$el.html( layout.el );

      // input
      var input = new TypeaheadInputView({
        comment: {
          item_id: this.item.get('id')
        }
      });
      this.on('remove', input.remove);
      this.$('.typeahead').html(input.render().el);

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

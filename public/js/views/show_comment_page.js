define([
  'underscore', 'backbone',
  'current_user',
  'collections/comments', 'collections/activities',
  'views/layout', 'views/activity_stream',
  'views/typeahead/input',
  'text!templates/show_comment_page.html'
], function module(_, Backbone,
  currentUser,
  commentCollection, activityCollections,
  LayoutView, ActivityStreamView,
  TypeaheadInputView,
  pageTemplate){

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
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var that = this,
          page = this.template({
            currentUserIsOwner: this.comment.get('owner_id') === currentUser.user_id,
            comment: this.comment
          }),
          input = new TypeaheadInputView({
            comment: {
              reply_to_id: this.comment.get('id')
            }
          });

      var activityCollection = activityCollections.get('comment_'+this.comment.get('id'));
      activityCollection.fetch({
        data: 'comment_id='+this.comment.get('id')
      });
      var stream = new ActivityStreamView({
        collection: activityCollection
      });
      this.$('.activity-stream').html(stream.render().el);
      commentCollection.on('sync', function(){
        activityCollection.fetch({
          data: 'comment_id='+this.user.get('id')
        });
      });

      // render
      var layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );
      this.$('.typeahead').html(input.render().el);
      this.$('.activity-stream').html(stream.render().el);

      // clean up
      this.on('remove', function(){
        layout.remove();
        input.remove();
        stream.remove();
      });
    }
  });
  return View;

});

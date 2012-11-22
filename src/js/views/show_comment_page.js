define([
  'underscore', 'backbone',
  'current_user', 'likeable',
  'collections/comments', 'collections/activities', 'collections/likes',
  'views/layout', 'views/activity_stream',
  'views/typeahead/input',
  'text!templates/show_comment_page.html'
], function module(_, Backbone,
  currentUser, likeable,
  commentCollection, activityCollections, likeCollection,
  LayoutView, ActivityStreamView,
  TypeaheadInputView,
  pageTemplate){

  var View = Backbone.View.extend({
    template: _.template( pageTemplate ),
    events: {
      'click .like.btn': 'likeHandler', // added by extension
      'click h1.editable': 'editText',
      'blur input[data-field="text"]': 'saveText',
      'click .destroy': 'destroyItem'
    },
    likeableType: 'comment',
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
      this.activityCollection = activityCollections.get('comment_'+id);
      this.render();
    },
    remove: function(){
      this.trigger('remove');
      Backbone.View.prototype.remove.call(this);
      this.off();
    },
    fetchActivity: function(){
      this.activityCollection.fetch({
        data: 'comment_id='+this.comment.get('id')
      });
    },
    render: function(){
      var page = this.template({
            isLiked: likeCollection.where({comment_id:this.comment.get('id'), owner_id:currentUser.user_id}).length > 0,
            currentUserIsOwner: this.comment.get('owner_id') === currentUser.user_id,
            comment: this.comment
          });

      var layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );

      var input = new TypeaheadInputView({
        comment: {
          reply_to_id: this.comment.get('id')
        }
      });
      this.$('.typeahead').html(input.render().el);

      this.fetchActivity();
      var activityStream = new ActivityStreamView({
        collection: this.activityCollection
      });
      commentCollection.on('sync', this.fetchActivity, this);
      this.$('.activity-stream').html(activityStream.render().el);

      this.on('remove', function(){
        layout.remove();
        input.remove();
        activityStream.remove();
        commentCollection.off('sync', this.fetchActivity);
      });
    }
  });

  _.extend(View.prototype, likeable);

  return View;

});

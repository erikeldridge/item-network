define([
  'underscore', 'backbone',
  'current_user', 'likeable',
  'collections/comments', 'collections/activities', 'collections/likes',
  'collections/users', 'collections/items', 'collections/sessions',
  'views/layout', 'views/activity_stream',
  'views/typeahead/input',
  'text!templates/show_comment_page.html'
], function module(_, Backbone,
  currentUser, likeable,
  commentCollection, activityCollections, likeCollection,
  userCollection, itemCollection, sessionCollection,
  LayoutView, ActivityStreamView,
  TypeaheadInputView,
  pageTemplate){

  var View = Backbone.View.extend({
    template: _.template( pageTemplate ),
    events: {
      'click .like-button' : 'likeHandler', // added by extension
      'click .unlike-button' : 'unlikeHandler', // added by extension
      'click h1.editable': 'editText',
      'blur input[data-field="text"]': 'saveText',
      'click .destroy': 'destroyItem'
    },
    likeableModelName: 'comment',
    destroyItem: function(){
      this.comment.destroy();
      this.comment.on('sync', function(){
        Backbone.history.navigate('/comments', {trigger: true});
      });
      this.remove();
    },
    editText: function(e){
      var $el = $(e.target),
          text = this.comment.get('text'),
          $input = $('<input type="text" value="'+text+'" data-field="text">');
      $el.replaceWith($input);
      $input.focus();
    },
    saveText: function(e){
      var $input = $(e.target),
          text = $input.val().replace(/^\s+|\s+$/, ''),
          $el = $('<h1 class="comment editable" data-id="'+this.comment.get('id')+'">'+
            text.replace(/\[(user|item)-(\d+)\]/g, '<span class="$1" data-id="$2"></span>')+
            '</h1>');
      this.comment.save('text', text);
      $input.replaceWith($el);
      this.renderCommentText();
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
    renderCommentText: function(){
      this.$('.item').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            item = itemCollection.get(id);
        $el.replaceWith('<a class="item" href="/items/'+id+'" data-id="'+id+'">'+item.get('name')+'</a>');
      });

      this.$('.user').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            user = userCollection.get(id);
        $el.replaceWith('<a class="user" href="/users/'+id+'" data-id="'+id+'">'+user.get('name')+'</a>');
      });
    },
    render: function(){
      var session = sessionCollection.first(),
      pageVars = {
        session: session,
        comment: this.comment,
        like: false,
        currentUserIsOwner: false
      };

      if(session){
        var likes = likeCollection.where({
          comment_id: this.comment.get('id'),
          owner_id: session.get('user_id')
        });
        pageVars.like = _.first(likes);
        pageVars.currentUserIsOwner = this.comment.get('owner_id') === session.get('user_id');
      }

      var page = this.template(pageVars),
      layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );

      this.renderCommentText();

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

define([
  'zepto', 'underscore', 'backbone',
  'current_user', 'likeable',
  'collections/groups', 'collections/users', 'collections/comments',
  'collections/memberships', 'collections/likes',
  'views/layout', 'views/comment', 'views/comment_form',
  'views/stream', 'views/typeahead/input',
  'text!templates/show_group_page.html',
  'text!templates/comment_search_results.html',
  'text!templates/membership_stream.html'
], function module($, _, Backbone,
  currentUser, likeable,
  groupCollection, userCollection, commentCollection,
  membershipCollection, likeCollection,
  LayoutView, CommentView, CommentFormView,
  StreamView, TypeaheadInputView,
  pageTemplate,
  commentSearchResultsTemplate,
  membershipStreamTemplate ){

  var View = Backbone.View.extend({
    template: _.template( pageTemplate ),
    events: {
      'click .btn': 'likeHandler', // added by extension
      'click h1.editable': 'editName',
      'blur input[data-field="name"]': 'saveName',
      'click .destroy': 'destroyRecord'
    },
    likeableType: 'group',
    destroyRecord: function(){
      this.group.destroy();
      this.group.on('sync', function(){
        Backbone.history.navigate('/groups', {trigger: true});
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
      this.group.save('name', name);
      $input.replaceWith($el);
    },
    initialize: function(options){
      var id = options.params[0];
      this.group = groupCollection.get(id);
      this.owner = userCollection.get(this.group.get('owner_id'));
      this.render();
    },
    remove: function(){
      this.trigger('remove');
      Backbone.View.prototype.remove.call(this);
      this.off();
    },
    render: function(){
      var page = this.template({
            currentUserIsOwner: this.group.get('owner_id') === currentUser.user_id,
            isLiked: likeCollection.where({group_id:this.group.get('id'), owner_id:currentUser.user_id}).length > 0,
            group: this.group,
            owner: this.owner
          }),
          that = this,
          commentStream,
          membershipStream;

      var layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );

      // input
      var input = new TypeaheadInputView({
        comment: {
          item_id: this.group.get('id')
        }
      });
      this.$('.typeahead').html(input.render().el);

      // comments
      commentStream = new StreamView({
        template: commentSearchResultsTemplate,
        collection: commentCollection,
        filter: function(comment){
          return comment.get('group_id') === that.group.get('id');
        }
      });
      this.$('.comment-stream').html(commentStream.render().el);

      // members
      membershipStream = new StreamView({
        template: membershipStreamTemplate,
        collection: membershipCollection,
        filter: function(model){
          return model.get('group_id') === that.group.get('id');
        }
      });
      this.$('.membership-stream').html(membershipStream.render().el);

      this.on('remove', function(){
        layout.remove();
        input.remove();
        membershipStream.remove();
        commentStream.remove();
      });

    }
  });

  _.extend(View.prototype, likeable);

  return View;

});

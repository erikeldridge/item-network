define([
  'underscore',
  'backbone',
  'current_user',
  'likeable',
  'collections/users',
  'collections/comments',
  'collections/likes',
  'collections/activities',
  'collections/memberships',
  'views/layout',
  'views/stream',
  'views/activity_stream',
  'views/typeahead/input',
  'text!templates/show_user_page.html',
  'text!templates/comment_search_results.html',
  'text!templates/membership_stream.html'
], function module(_, Backbone,
  currentUser, likeable,
  userCollection, commentCollection, likeCollection, activityCollection, membershipCollection,
  LayoutView, StreamView, ActivityStreamView, TypeaheadInputView,
  showUserPageTemplate, commentSearchResultsTemplate, membershipStreamTemplate ){

  var View = Backbone.View.extend({
    template: _.template( showUserPageTemplate ),
    events: {
      'click .btn': 'likeHandler',
      'click h1.editable': 'editName',
      'blur input[data-field="name"]': 'saveName'
    },
    likeableType: 'user',
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
      this.user.set('name', name).save();
      $input.replaceWith($el);
    },
    initialize: function(options){
      var id = options.params[0];
      this.user = userCollection.get(id);
      this.render();
    },
    remove: function(){
      this.trigger('remove');
      Backbone.View.prototype.remove.call(this);
      this.off();
    },
    render: function(){
      var that = this,
          page = this.template({
            user: this.user,
            isCurrentUser: this.user.get('id') === currentUser.user_id,
            isLiked: likeCollection.where({user_id:this.user.get('id'), owner_id:currentUser.user_id}).length > 0
          }),
          commentStream = new StreamView({
            template: commentSearchResultsTemplate,
            collection: commentCollection,
            filter: function(comment){
              var isOwner = comment.get('owner_id') === that.user.get('id'),
                  isTo = comment.get('user_id') === that.user.get('id');
              return isOwner || isTo;
            }
          }),
          membershipStream = new StreamView({
            template: membershipStreamTemplate,
            collection: membershipCollection,
            filter: function(model){
              return model.get('user_id') === that.user.get('id');
            }
          }),
          activityStream = new ActivityStreamView({
            filter: function(model){
              var isOwner = model.get('owner_id') === that.user.get('id')
              return isOwner;
            }
          }),
          input = new TypeaheadInputView({
            comment: {
              user_id: this.user.get('id')
            }
          });

      var layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );

      this.$('.typeahead').html(input.render().el);
      this.$('.comment-stream').html(commentStream.render().el);
      this.$('.activity-stream').html(activityStream.render().el);
      this.$('.membership-stream').html(membershipStream.render().el);

      // clean up
      this.on('remove', function(){
        layout.remove();
        commentStream.remove();
        activityStream.remove();
        membershipStream.remove();
        input.remove();
      });
    }
  });

  _.extend(View.prototype, likeable);

  return View;

});

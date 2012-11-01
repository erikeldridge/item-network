define([
  'underscore',
  'backbone',
  'current_user',
  'collections/users',
  'collections/comments',
  'collections/user_likes',
  'collections/activities',
  'views/stream',
  'views/typeahead/input',
  'text!templates/show_user_page.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone, currentUser,
  userCollection, commentCollection, userLikesCollection, activityCollection,
  StreamView, TypeaheadInputView,
  showUserPageTemplate, commentSearchResultsTemplate){

  var View = Backbone.View.extend({
    template: _.template( showUserPageTemplate ),
    events: {
      'click .btn': 'like',
      'click h1.editable': 'editName',
      'blur input[data-field="name"]': 'saveName'
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
      this.user.set('name', name).save();
      $input.replaceWith($el);
    },
    like: function(e){
      var like = {
        user_id: this.user.get('id')
      };
      userLikesCollection.on('sync', function(model){
        var $btn = $(e.currentTarget);
        $btn.addClass('btn-success');
        $btn.find('i').addClass('icon-white');
      }, this);
      userLikesCollection.create(like);
    },
    initialize: function(options){
      var id = options.params[0];
      this.user = userCollection.get(id);
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var that = this,
          html = this.template({
            user: this.user,
            isCurrentUser: this.user.get('id') === currentUser.user_id,
            isLiked: userLikesCollection.where({user_id:this.user.get('id'), owner_id:currentUser.user_id}).length > 0
          }),
          stream = new StreamView({
            template: commentSearchResultsTemplate,
            collection: commentCollection,
            filter: function(comment){
              var isOwner = comment.get('owner_id') === that.user.get('id'),
                  isTo = comment.get('user_id') === that.user.get('id');
              return isOwner || isTo;
            }
          }),
          input = new TypeaheadInputView({
            comment: {
              user_id: this.user.get('id')
            }
          });
      this.$el.html( html );
      this.$('.typeahead').html(input.render().el);
      this.$('.comment-stream').html(stream.render().el);
      this.on('remove', stream.remove);
      this.on('remove', input.remove);
    }
  });
  return View;

});

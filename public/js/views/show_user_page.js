define([
  'underscore', 'backbone',
  'current_user', 'likeable',
  'collections/users', 'collections/comments', 'collections/likes',
  'collections/activities', 'collections/contributors',
  'views/layout', 'views/activity_stream', 'views/stream',
  'views/typeahead/input',
  'text!templates/show_user_page.html',
  'text!templates/contributor_stream.html'
], function module(_, Backbone,
  currentUser, likeable,
  userCollection, commentCollection, likeCollection,
  activityCollections, contributorCollection,
  LayoutView, ActivityStreamView, StreamView,
  TypeaheadInputView,
  pageTemplate,
  contributorStreamTemplate){

  var View = Backbone.View.extend({
    template: _.template( pageTemplate ),
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
      var query = this.options.params[0],
          that = this,
          page = this.template({
            user: this.user,
            isCurrentUser: this.user.get('id') === currentUser.user_id,
            isLiked: likeCollection.where({user_id:this.user.get('id'), owner_id:currentUser.user_id}).length > 0
          });

      var layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );

      var input = new TypeaheadInputView({
        comment: {
          user_id: this.user.get('id')
        }
      });
      this.$('.typeahead').html(input.render().el);

      var activityCollection = activityCollections.get('user_'+this.user.get('id'));
      activityCollection.fetch({
        data: 'user_id='+this.user.get('id')
      });
      var activityStream = new ActivityStreamView({
        collection: activityCollection
      });
      this.$('.activity-stream').html(activityStream.render().el);
      commentCollection.on('sync', function(){
        activityCollection.fetch({
          data: 'user_id='+this.user.get('id')
        });
      });

      var contributorStream = new StreamView({
        template: contributorStreamTemplate,
        collection: contributorCollection,
        filter: function(model){
          return model.get('contributor_id') === that.user.get('id');
        }
      });
      this.$('.contributor-stream').html(contributorStream.render().el);

      this.on('remove', function(){
        layout.remove();
        activityStream.remove();
        contributorStream.remove();
        input.remove();
      });
    }
  });

  _.extend(View.prototype, likeable);

  return View;

});

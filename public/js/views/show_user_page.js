define([
  'underscore', 'backbone',
  'current_user', 'likeable', 'activities',
  'collections/users', 'collections/comments', 'collections/likes',
  'collections/mentions', 'collections/activities', 'collections/contributors',
  'views/layout', 'views/stream', 'views/activity_stream',
  'views/typeahead/input',
  'text!templates/show_user_page.html',
  'text!templates/comment_search_results.html',
  'text!templates/contributor_stream.html',
  'text!templates/user_activity_stream.html'
], function module(_, Backbone,
  currentUser, likeable, activities,
  userCollection, commentCollection, likeCollection,
  mentionCollection, activityCollection, contributorCollection,
  LayoutView, StreamView, ActivityStreamView,
  TypeaheadInputView,
  showUserPageTemplate,
  commentSearchResultsTemplate,
  contributorStreamTemplate,
  userActivityStreamTemplate ){

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

      var model = Backbone.Model.extend({
        idAttribute: "model_id"
      });
      var Collection = Backbone.Collection.extend({
        url: '/api/1/activities/user/'+id,
        model: model,
        parse: function(resp){
          var activities = [];
          _.each(resp.likes, function(like){
            likeCollection.add(like);
            like.model_id = 'like-'+like.id;
            activities.push(like);
          });
          _.each(resp.comments, function(comment){
            commentCollection.add(comment);
            comment.model_id = 'comment-'+comment.id;
            activities.push(comment);
          });
          return activities;
        },
        comparator: function(model) {
          return model.get("created_at");
        }
      });
      this.activityCollection = new Collection();
      this.activityCollection.fetch();

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

      var activityStream = new StreamView({
        template: userActivityStreamTemplate,
        collection: this.activityCollection
      });
      commentCollection.on('sync', function(){
        this.activityCollection.fetch();
      });
      this.$('.activity-stream').html(activityStream.render().el);

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

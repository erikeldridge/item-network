define([
  'underscore', 'backbone',
  'current_user', 'likeable',
  'collections/users', 'collections/comments', 'collections/likes',
  'collections/mentions', 'collections/activities', 'collections/contributors',
  'views/layout', 'views/stream', 'views/activity_stream',
  'views/typeahead/input',
  'text!templates/show_user_page.html',
  'text!templates/comment_search_results.html',
  'text!templates/contributor_stream.html',
  'text!templates/user_activity_stream.html'
], function module(_, Backbone,
  currentUser, likeable,
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
          contributorStream = new StreamView({
            template: contributorStreamTemplate,
            collection: contributorCollection,
            filter: function(model){
              return model.get('contributor_id') === that.user.get('id');
            }
          }),
          input = new TypeaheadInputView({
            comment: {
              user_id: this.user.get('id')
            }
          });

      // stream
      var model = Backbone.Model.extend({
            idAttribute: "model_id"
          }),
          Collection = Backbone.Collection.extend({
            model: model,
            comparator: function(model) {
              return model.get("created_at");
            }
          }),
          collection = new Collection(),
          activityStream;

      // likes, comments, mentions from users, items, and comments I like
      activityCollection.each(function(model){

        if('users' === model.get('table') && model.get('row') === this.user.get('id')){
          model.set('model_id', 'activity-'+model.get('id'));
          collection.add(model.toJSON());
        }
      }, this);

      likeCollection.each(function(model){
        if( (model.get('user_id') === this.user.get('id')) ||
          (model.get('user_id') && model.get('owner_id') === this.user.get('id')) ){
          model.set('model_id', 'like-'+model.get('id'));
          collection.add(model.toJSON()); // toJSON so collection uses model_id instead of native id
        }
      }, this);
      mentionCollection.each(function(model){
        if(model.get('user_id') === this.user.get('id')){
          model.set('model_id', 'mention-'+model.get('id'));
          collection.add(model.toJSON());
        }
      }, this);
      commentCollection.each(function(model){
        if( (model.get('user_id') === this.user.get('id')) ||
          (model.get('owner_id') === this.user.get('id')) ){
          model.set('model_id', 'comment-'+model.get('id'));
          collection.add(model.toJSON());
        }
      }, this);
      activityCollection.each(function(model){
        if('users' === model.get('table') && model.get('row') === this.user.get('id')){
          model.set('model_id', 'activity-'+model.get('id'));
          collection.add(model.toJSON());
        }
      }, this);

      activityStream = new StreamView({
        template: userActivityStreamTemplate,
        collection: collection
      });

      // render
      var layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );

      this.$('.typeahead').html(input.render().el);
      this.$('.activity-stream').html(activityStream.render().el);
      this.$('.contributor-stream').html(contributorStream.render().el);

      // clean up
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

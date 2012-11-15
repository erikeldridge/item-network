define([
  'underscore', 'backbone',
  'current_user',
  'collections/comments', 'collections/items', 'collections/users',
  'collections/comment_tags', 'collections/activities', 'collections/likes',
  'views/layout', 'views/comment_tag_form', 'views/stream',
  'views/typeahead/input',
  'text!templates/show_comment_page.html',
  'text!templates/comment_search_results.html',
  'text!templates/comment_activity_stream.html'
], function module(_, Backbone,
  currentUser,
  commentCollection, itemCollection, userCollection,
  tagCollection, activityCollection, likeCollection,
  LayoutView, CommentTagFormView, StreamView,
  TypeaheadInputView,
  pageTemplate,
  streamTemplate,
  commentActivityStreamTemplate){

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
      likeCollection.each(function(model){
        if(model.get('comment_id') === this.comment.get('id')){
          model.set('model_id', 'like-'+model.get('id'));
          collection.add(model.toJSON()); // toJSON so collection uses model_id instead of native id
        }
      }, this);
      commentCollection.each(function(model){
        if(model.get('reply_to_id') === this.comment.get('id')){
          model.set('model_id', 'comment-'+model.get('id'));
          collection.add(model.toJSON());
        }
      }, this);
      activityCollection.each(function(model){
        if('comments' === model.get('table') &&
          this.comment.get('id') === model.get('row') ){
          model.set('model_id', 'activity-'+model.get('id'));
          collection.add(model.toJSON());
        }
      }, this);

      activityStream = new StreamView({
        template: commentActivityStreamTemplate,
        collection: collection
      });

      // render
      var layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );
      this.$('.typeahead').html(input.render().el);
      this.$('.activity-stream').html(activityStream.render().el);

      // clean up
      this.on('remove', function(){
        layout.remove();
        input.remove();
        activityStream.remove();
      });
    }
  });
  return View;

});

define([
  'zepto', 'underscore', 'backbone',
  'current_user', 'likeable',
  'collections/items', 'collections/users', 'collections/comments',
  'collections/activities', 'collections/likes', 'collections/mentions',
  'views/layout',
  'views/comment',
  'views/comment_form',
  'views/stream',
  'views/activity_stream',
  'views/typeahead/input',
  'text!templates/show_item_page.html',
  'text!templates/comment_search_results.html',
  'text!templates/user_activity_stream.html'
], function module($, _, Backbone,
  currentUser, likeable,
  itemCollection, userCollection, commentCollection,
  activityCollections, likeCollection, mentionCollection,
  LayoutView, CommentView, CommentFormView, StreamView, ActivityStreamView, TypeaheadInputView,
  template, commentSearchResultsTemplate, streamTemplate){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'click .btn': 'likeHandler', // added by extension
      'click h1.editable': 'editName',
      'blur input[data-field="name"]': 'saveName',
      'click .destroy': 'destroyItem'
    },
    likeableType: 'item',
    destroyItem: function(){
      this.item.destroy();
      this.item.on('sync', function(){
        Backbone.history.navigate('/items', {trigger: true});
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
      this.item.save('name', name);
      $input.replaceWith($el);
    },
    initialize: function(options){
      var id = options.params[0];
      this.item = itemCollection.get(id);
      this.owner = userCollection.get(this.item.get('owner_id'));
      this.render();
    },
    remove: function(){
      this.trigger('remove');
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var page = this.template({
            currentUserIsOwner: this.item.get('owner_id') === currentUser.user_id,
            isLiked: likeCollection.where({item_id:this.item.get('id'), owner_id:currentUser.user_id}).length > 0,
            item: this.item,
            owner: this.owner
          }),
          stream;

      var layout = new LayoutView({
        page: page
      });
      this.$el.html( layout.el );

      var input = new TypeaheadInputView({
        comment: {
          item_id: this.item.get('id')
        }
      });
      this.$('.typeahead').html(input.render().el);

      var activityCollection = activityCollections.get('item_'+this.item.get('id'));
      activityCollection.fetch({
        data: 'item_id='+this.item.get('id')
      });
      var stream = new StreamView({
        template: streamTemplate,
        collection: activityCollection
      });
      commentCollection.on('sync', function(){
        activityCollection.fetch({
          data: 'item_id='+this.user.get('id')
        });
      });
      this.$('.activity-stream').html(stream.render().el);

      this.on('remove', function(){
        layout.remove();
        input.remove();
        stream.remove();
      });

    }
  });

  _.extend(View.prototype, likeable);

  return View;

});

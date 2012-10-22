define([
  'underscore',
  'backbone',
  'collections/comment_search_results',
  'collections/items',
  'collections/users',
  'text!templates/comment_search_results_page.html',
], function module(_, Backbone,
  commentSearchResultCollection, itemCollection, userCollection,
  template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var query = this.options.params[0];
      commentSearchResultCollection.fetch({
        data: query,
        success: _.bind(function(commentCollection){
          var itemIds = [],
              userIds = [],
              comments = [];
          commentCollection.each(function(comment){
            comment = comment.toJSON();
            var itemIdMatches = _.toArray( comment.text.match(/{item-(\d+)}/) ),
                userIdMatches = _.toArray( comment.text.match(/{user-(\d+)}/) );
            itemIdMatches.shift();
            userIdMatches.shift();
            itemIds = itemIds.concat(itemIdMatches);
            userIds = userIds.concat(userIdMatches);
            comment.text = comment.text.replace(/{([^-]+-\d+)}/g, '<span data-model-id="$1"></span>');
            comments.push(comment);
          });
          var html = this.template({
            comments: comments
          });
          this.$el.html( html );
          _.each(_.uniq(itemIds), function(id){
            var item = itemCollection.get(id);
            this.$('span[data-model-id=item-'+id+']').html(item.get('name'));
          }, this);
          _.each(_.uniq(userIds), function(id){
            var user = userCollection.get(id);
            this.$('span[data-model-id=user-'+id+']').html(user.get('name'));
          }, this);
        }, this)
      });
    }
  });
  return View;

});

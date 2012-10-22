define([
  'underscore',
  'backbone',
  'collections/comments',
  'collections/items',
  'collections/users',
  'text!templates/show_comment_page.html'
], function module(_, Backbone, commentCollection, itemCollection, userCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
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
      var text = this.comment.get('text'),
          itemIds = text.match(/{item-(\d+)}/) || [],
          userIds = text.match(/{user-(\d+)}/) || [];
      text = text.replace(/{([^-]+-\d+)}/g, '<a data-model-id="$1"></a>');
      itemIds.shift();
      userIds.shift();
      var html = this.template({
            comment: this.comment,
            text: text
          });
      this.$el.html( html );
      _.each(itemIds, function(id){
        var item = itemCollection.get(id);
        this.$('a[data-model-id=item-'+id+']').attr('href', '/items/'+id).html(item.get('name'));
      }, this);
      _.each(userIds, function(id){
        var user = userCollection.get(id);
        this.$('a[data-model-id=user-'+id+']').attr('href', '/users/'+id).html(user.get('name'));
      }, this);
    }
  });
  return View;

});

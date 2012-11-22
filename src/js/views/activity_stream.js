define([
  'zepto', 'underscore', 'backbone',
  'collections/items', 'collections/users', 'collections/comments',
  'collections/likes',
  'text!templates/activity_stream.html'
], function module($, _, Backbone,
  itemCollection, userCollection, commentCollection,
  likeCollection,
  template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(){
      this.collection.on('add reset sync', this.render, this);
    },
    remove: function(){
      Backbone.View.prototype.remove.call(this);
      this.off();
    },
    render: function(){
      var limit = this.options.limit || 20,
          html = this.template({
            activities: this.collection.last(limit)
          });
      this.$el.html( html );

      this.$('.comment').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            comment = commentCollection.get(id),
            ownerId = comment.get('owner_id'),
            text = comment.get('text').replace(/\[(user|item)-(\d+)\]/g, '<a class="$1" href="/$1s/$2" data-id="$2"></a>')
        $el.html(
          '<a class="user" href="/users/'+ownerId+'" data-id="'+ownerId+'"></a>: '+
          text+
          ' <a href="/comments/'+comment.get('id')+'">...</a>');
      });

      this.$('.like').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            like = likeCollection.get(id),
            ownerId = like.get('owner_id');
        $el.html('<a class="user" href="/users/'+ownerId+'" data-id="'+ownerId+'"></a> liked');
      });

      this.$('.item').each(function(i, el){
        var $el = $(el),
            id = $el.data('id');
        $el.html( itemCollection.get(id).get('name') );
      });

      this.$('.user').each(function(i, el){
        var $el = $(el),
            id = $el.data('id');
        $el.html( userCollection.get(id).get('name') );
      });

      return this;
    }
  });

  return View;

});

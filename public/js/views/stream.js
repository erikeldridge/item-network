define([
  'underscore', 'backbone',
  'collections/items', 'collections/users', 'collections/comments',
  'collections/likes',
], function module(_, Backbone,
  itemCollection, userCollection, commentCollection,
  likeCollection){

  var View = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template( options.template )
      this.collection.on('add reset', function(){
        this.render();
      }, this);
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var limit = this.options.limit || 20,
          collection,
          html;
      if(this.options.filter){
        collection = this.collection.filter(this.options.filter).splice(-limit)
      }else{
        collection = this.collection.last(limit)
      }
      html = this.template({
        collection: collection
      });
      this.$el.html( html );

      this.$('.comment').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            comment = commentCollection.get(id),
            ownerId = comment.get('owner_id'),
            text = comment.get('text').replace(/\[(user|item)-(\d+)\]/g, '<a class="$1-sm" href="/$1s/$2" data-$1-id="$2"></a>')
        $el.html(
          '<a class="user-sm" href="/users/'+ownerId+'" data-user-id="'+ownerId+'"></a>: '+
          text+
          '<a href="/comments/'+comment.get('id')+'">...</a>');
      });

      this.$('.like').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            like = likeCollection.get(id),
            ownerId = like.get('owner_id');
        $el.html('<a class="user-sm" href="/users/'+ownerId+'" data-user-id="'+ownerId+'"></a> liked');
      });

      this.$('.item-sm').each(function(i, el){
        var $el = $(el),
            id = $el.data('item-id');
        $el.html( itemCollection.get(id).get('name') );
      });

      this.$('.user-sm').each(function(i, el){
        var $el = $(el),
            id = $el.data('user-id');
        $el.html( userCollection.get(id).get('name') );
      });

      return this;
    }
  });
  return View;

});

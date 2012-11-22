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
            text = comment.get('text').replace(/\[(user|item)-(\d+)\]/g, '<a class="$1" href="/$1s/$2" data-id="$2"></a>')
        $el.html(
          '<a class="user" href="/users/'+ownerId+'" data-id="'+ownerId+'"></a>: '+
          text+
          '<a href="/comments/'+comment.get('id')+'">...</a>');
      });

      this.$('.comment').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            comment = commentCollection.get(id),
            ownerId = comment.get('owner_id'),
            text = comment.get('text').replace(/\[(user|item)-(\d+)\]/g, '<a class="$1" href="/$1s/$2" data-id="$2"></a>')
        $el.replaceWith(
          '<a class="user" href="/users/'+ownerId+'" data-id="'+ownerId+'"></a>: '+
          text+
          ' <a href="/comments/'+comment.get('id')+'">...</a>');
      });

      this.$('.like').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            like = likeCollection.get(id),
            ownerId = like.get('owner_id');
        $el.replaceWith('<a class="user" href="/users/'+ownerId+'" data-id="'+ownerId+'"></a> liked');
      });

      this.$('.item').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            item = itemCollection.get(id);
        $el.replaceWith('<a class="item" href="/items/'+id+'" data-id="'+id+'">'+item.get('name')+'</a>');
      });

      this.$('.user').each(function(i, el){
        var $el = $(el),
            id = $el.data('id'),
            user = userCollection.get(id);
        $el.replaceWith('<a class="user" href="/users/'+id+'" data-id="'+id+'">'+user.get('name')+'</a>');
      });

      return this;
    }
  });
  return View;

});

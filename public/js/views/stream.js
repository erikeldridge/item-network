define([
  'underscore',
  'backbone',
  'collections/items'
], function module(_, Backbone, itemCollection){

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

      this.$('.item-sm').each(function(i, el){
        var $el = $(el),
            id = $el.data('item-id');
        $el.html( itemCollection.get(id).get('name') );
      });

      return this;
    }
  });
  return View;

});

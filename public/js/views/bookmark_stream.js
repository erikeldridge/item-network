define([
  'underscore',
  'backbone',
  'collections/bookmarks',
  'text!templates/bookmark_stream.html'
], function module(_, Backbone, collection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(){
      collection.on('add reset', function(){
        this.render();
      }, this);
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
            bookmarks: collection.toArray()
          });
      this.$el.html( html );
      return this;
    }
  });
  return View;

});

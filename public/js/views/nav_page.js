define([
  'underscore',
  'backbone',
  'collections/bookmarks',
  'views/bookmark_stream',
  'text!templates/nav_page.html'
], function module(_, Backbone,
  bookmarkCollection,
  StreamView,
  pageTemplate){

  var View = Backbone.View.extend({
      template: _.template( pageTemplate ),
      initialize: function(){
        this.render();
      },
      remove: function(){
        this.undelegateEvents();
        Backbone.View.prototype.remove.call(this);
      },
      render: function(){
        var html = this.template();
        this.$el.html( html );
        var stream = new StreamView();
        this.on('remove', stream.remove);
        this.$('.bookmark-stream').append(stream.render().el);
      }
    });
  return View;

});

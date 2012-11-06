define([
  'underscore',
  'backbone',
  'collections/bookmarks',
  'views/bookmark_stream',
  'views/nav_layout',
  'text!templates/nav_page.html'
], function module(_, Backbone,
  bookmarkCollection,
  StreamView, LayoutView,
  pageTemplate){

  var View = Backbone.View.extend({
      template: _.template( pageTemplate ),
      initialize: function(){
        this.render();
      },
      remove: function(){
        this.off();
        Backbone.View.prototype.remove.call(this);
      },
      render: function(){
        var layout = new LayoutView({
          page: this.template()
        });
        this.on('remove', layout.remove);
        this.$el.html( layout.el );

        var stream = new StreamView();
        this.on('remove', stream.remove);
        this.$('.bookmark-stream').append(stream.render().el);
      }
    });
  return View;

});

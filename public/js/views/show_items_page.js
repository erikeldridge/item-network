define([
  'underscore',
  'backbone',
  'collections/items',
  'text!templates/show_items_page.html'
], function module(_, Backbone, itemCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(){
      this.render();
    },
    close: function(){
      this.undelegateEvents();
      this.remove();
    },
    render: function(){
      var itemId = this.options.params[0],
          items = itemCollection.first(20),
          html = this.template({
            items: items
          });
      this.$el.html( html );
    }
  });
  return View;

});

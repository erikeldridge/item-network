define([
  'underscore',
  'backbone',
  'collections/items',
  'text!templates/show_item_page.html'
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
          item = itemCollection.get(itemId);
          html = this.template({
            item: item
          });
      this.$el.html( html );
    }
  });
  return View;

});

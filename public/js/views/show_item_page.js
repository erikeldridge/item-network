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
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
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

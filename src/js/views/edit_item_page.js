define([
  'underscore',
  'backbone',
  'collections/items',
  'text!templates/edit_item_page.html'
], function module(_, Backbone, itemCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'click .btn': 'save'
    },
    save: function(e){
      var name = this.$('input[name="name"]').val(),
          tag = this.$('input[name="tag"]').val();
      this.tag.destroy();
      // tagCollection.create({
      //   text: tag,
      //   item_id: this.item.get('id')
      // });
    },
    initialize: function(config){
      var itemId = parseInt(config.params[0], 10);
      this.item = itemCollection.get(itemId);
      this.tag = tagCollection.where({item_id: itemId})[0] || new Backbone.Model();
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
            item: this.item,
            tag: this.tag
          });
      this.$el.html( html );
    }
  });
  return View;

});

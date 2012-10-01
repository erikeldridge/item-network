define([
  'underscore',
  'backbone',
  'collections/users',
  'collections/items',
  'text!templates/create_item_page.html',
  'bootstrap'
], function module(_, Backbone, userCollection, itemCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'submit'
    },
    initialize: function(){
      this.render();
    },
    close: function(){
      this.undelegateEvents();
      this.remove();
    },
    render: function(){
      var html = this.template();
      this.$el.html( html );
    },
    submit: function(e){
      var name = this.$el.find('input[name=name]').val(),
          owner = userCollection.get({id: 1}),
          item = {
            name: name,
            created_by_id: owner.get('id')
          };
      itemCollection.create(item);
      return false;
    }
  });
  return View;

});

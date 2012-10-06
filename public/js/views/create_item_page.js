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
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template();
      this.$el.html( html );
    },
    submit: function(e){
      var name = this.$el.find('input[name=name]').val(),
          owner = userCollection.get({id: 1}),
          item = {
            name: name
          };
      itemCollection.on('sync', function(){
        this.$('.alert-success').show();
      }, this);
      itemCollection.create(item);
      return false;
    }
  });
  return View;

});

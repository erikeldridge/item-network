define([
  'backbone',
  'collections/typeahead/phrases'
], function module(Backbone, collection){

  var View = Backbone.View.extend({
        initialize: function(){
          collection.on('add remove', this.render, this);
          this.render();
        },
        remove: function(){
          this.undelegateEvents();
          Backbone.View.prototype.remove.call(this);
        },
        render: function(){
          var text = collection.pluck('text').join(' ');
          this.$el.html( text );
          return this;
        }
      });

  return View;

});

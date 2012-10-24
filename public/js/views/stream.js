define([
  'underscore',
  'backbone'
], function module(_, Backbone){

  var View = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template( options.template )
      this.collection.on('add reset', function(){
        this.render();
      }, this);
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var limit = this.options.limit || 20,
          html = this.template({
            collection: this.collection.last(limit)
          });
      this.$el.html( html );
      return this;
    }
  });
  return View;

});

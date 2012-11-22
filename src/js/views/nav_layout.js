define([
  'backbone',
  'text!templates/nav_layout.html'
], function module(Backbone, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(){
      this.render();
    },
    remove: function(){
      Backbone.View.prototype.remove.call(this);
      this.off();
    },
    render: function(){
      var html = this.template(this.options);
      this.$el.html( html );
    }
  });
  return View;

});

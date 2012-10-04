define([
  'underscore',
  'backbone',
  'text!templates/nav_page.html'
], function module(_, Backbone, template){

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
      var html = this.template();
      this.$el.html( html );
    }
  });
  return View;

});

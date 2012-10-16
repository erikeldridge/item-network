define([
  'underscore',
  'backbone',
  'collections/comment_tags',
  'text!templates/comment_tag.html',
  'bootstrap'
], function module(_, Backbone, commentTagCollection, template){

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

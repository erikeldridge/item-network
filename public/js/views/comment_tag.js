define([
  'underscore',
  'backbone',
  'text!templates/comment_tag.html',
  'bootstrap'
], function module(_, Backbone, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'click .remove': 'remove'
    },
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.options.tag.destroy();
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
        tag: this.options.tag
      });
      this.$el.html( html );
    }
  });
  return View;

});

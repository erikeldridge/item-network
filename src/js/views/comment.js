define([
  'zepto',
  'underscore',
  'backbone',
  'text!templates/comment.html'
], function module($, _, Backbone, template){

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
      var html = this.template({
            comment: this.options.comment
          });
      this.$el.html( html );
    }
  });
  return View;

});

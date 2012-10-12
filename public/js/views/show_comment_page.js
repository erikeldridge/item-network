define([
  'underscore',
  'backbone',
  'collections/comments',
  'text!templates/show_comment_page.html'
], function module(_, Backbone, commentCollection, template){

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
      var id = this.options.params[0],
          comment = commentCollection.get(id);
          html = this.template({
            comment: comment
          });
      this.$el.html( html );
    }
  });
  return View;

});

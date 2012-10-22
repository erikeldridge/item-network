define([
  'underscore',
  'backbone',
  'collections/comments',
  'views/comment_tag',
  'text!templates/show_comment_page.html'
], function module(_, Backbone, commentCollection, CommentTagView, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(options){
      var id = options.params[0];
      this.comment = commentCollection.get(id);
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
            comment: this.comment
          });
      this.$el.html( html );
    }
  });
  return View;

});

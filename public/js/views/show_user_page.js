define([
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'text!templates/show_user_page.html'
], function module(_, Backbone, userCollection, commentCollection, template){

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
          user = userCollection.get(id),
          html = this.template({
            user: user,
            comments: commentCollection.where({owner_id:user.get('id')})
          });
      this.$el.html( html );
    }
  });
  return View;

});

define([
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/activities',
  'text!templates/nav_page.html'
], function module(_, Backbone,
  userCollection, commentCollection, activityCollection,
  template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'comment',
    },
    comment: function(e){
      var $input = this.$('input[name="text"]'),
          text = $input.val(),
          owner = userCollection.get({id: 1}), // HACK: current user
          comment = {
            text: text
          };
      commentCollection.on('sync', function(){
        this.$('.alert-success').show();
        $input.val('');
      }, this);
      commentCollection.create(comment);
      return false;
    },
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
        activities: activityCollection.first(3)
      });
      this.$el.html( html );
    }
  });
  return View;

});

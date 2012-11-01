define([
  'zepto',
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/activities',
  'collections/items',
  'views/typeahead/input',
  'views/activity_stream',
  'text!templates/home_page.html'
], function module($, _, Backbone,
  userCollection, commentCollection, activityCollection, itemCollection,
  TypeaheadInputView, ActivityStreamView,
  navPageTemplate){

  var View = Backbone.View.extend({
      template: _.template( navPageTemplate ),
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

        // input
        var input = new TypeaheadInputView();
        this.on('remove', input.remove);
        this.$('.typeahead').html(input.render().el);

        // activity stream
        var activityStream = new ActivityStreamView({
              limit: 3
            });
        this.on('remove', activityStream.remove);
        this.$('.activity-stream').html(activityStream.render().el);
      }
    });
  return View;

});

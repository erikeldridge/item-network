define([
  'zepto',
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/activities',
  'collections/items',
  'views/layout',
  'views/typeahead/input',
  'views/activity_stream',
  'text!templates/home_page.html'
], function module($, _, Backbone,
  userCollection, commentCollection, activityCollection, itemCollection,
  LayoutView, TypeaheadInputView, ActivityStreamView,
  navPageTemplate){


  var View = Backbone.View.extend({
      template: _.template( navPageTemplate ),
      initialize: function(){
        this.render();
      },
      remove: function(){
        this.trigger('remove');
        Backbone.View.prototype.remove.call(this);
        this.off();
      },
      render: function(){
        var layout = new LayoutView({
          page: this.template()
        });
        this.on('remove', layout.remove);
        this.$el.html( layout.el );

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

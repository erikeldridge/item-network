define([
  'zepto', 'underscore', 'backbone',
  'collections/activities', 'collections/comments',
  'views/layout', 'views/typeahead/input', 'views/activity_stream',
  'text!templates/home_page.html'
], function module($, _, Backbone,
  activityCollections, commentCollection,
  LayoutView, TypeaheadInputView, ActivityStreamView,
  pageTemplate){

  var View = Backbone.View.extend({
      template: _.template( pageTemplate ),
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
        this.$el.html( layout.el );

        var input = new TypeaheadInputView();
        this.$('.typeahead').html(input.render().el);

        var activityCollection = activityCollections.get('home');
        var activityStream = new ActivityStreamView({
          limit: 3,
          collection: activityCollection
        });
        this.$('.activity-stream').html(activityStream.render().el);
        activityCollection.fetch();
        commentCollection.on('sync', function(){
          activityCollection.fetch();
        });

        this.on('remove', function(){
          layout.remove();
          input.remove();
          activityStream.remove();
        });
      }
    });
  return View;

});

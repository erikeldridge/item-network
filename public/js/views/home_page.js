define([
  'zepto', 'underscore', 'backbone',
  'collections/activities', 'collections/likes',
  'collections/users', 'collections/comments', 'collections/items',
  'views/layout',
  'views/typeahead/input',
  'views/stream',
  'text!templates/home_page.html',
  'text!templates/home_activity_stream.html'
], function module($, _, Backbone,
  activityCollections, likeCollection,
  userCollection, commentCollection, itemCollection,
  LayoutView, TypeaheadInputView, StreamView,
  navPageTemplate, homeActivityStreamTemplate){

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
        this.$el.html( layout.el );

        var input = new TypeaheadInputView();
        this.$('.typeahead').html(input.render().el);

        var activityCollection = activityCollections.get('home');
        var stream = new StreamView({
          limit: 3,
          template: homeActivityStreamTemplate,
          collection: activityCollection
        });
        this.$('.activity-stream').html(stream.render().el);
        commentCollection.on('sync', function(){
          activityCollection.fetch(); // fetch latest activity when new comment is made
        });

        this.on('remove', function(){
          layout.remove();
          input.remove();
          stream.remove();
        });
      }
    });
  return View;

});

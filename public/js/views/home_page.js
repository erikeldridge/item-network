define([
  'zepto',
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/items',
  'views/layout',
  'views/typeahead/input',
  'views/stream',
  'text!templates/home_page.html',
  'text!templates/home_activity_stream.html'
], function module($, _, Backbone,
  userCollection, commentCollection, itemCollection,
  LayoutView, TypeaheadInputView, StreamView,
  navPageTemplate, homeActivityStreamTemplate){

  var View = Backbone.View.extend({
      template: _.template( navPageTemplate ),
      initialize: function(){

        var model = Backbone.Model.extend({
          idAttribute: "model_id"
        });
        var Collection = Backbone.Collection.extend({
          url: '/api/1/activities/home',
          model: model,
          comparator: function(model) {
            return model.get("created_at");
          }
        });
        this.activityCollection = new Collection();
        _.each(init.activities.home, function(model){;
          model.model_id = model.json_class.toLowerCase()+'-'+model.id;
          this.activityCollection.add(model);
        }, this);

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

        var stream = new StreamView({
          template: homeActivityStreamTemplate,
          collection: this.activityCollection
        });
        this.$('.activity-stream').html(stream.render().el);
        commentCollection.on('sync', function(){
          this.activityCollection.fetch(); // fetch latest activity when new comment is made
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

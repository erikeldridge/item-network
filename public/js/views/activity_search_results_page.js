define([
  'underscore',
  'backbone',
  'collections/activity_search_results',
  'text!templates/activity_search_results_page.html',
], function module(_, Backbone,
  activitySearchResultCollection, template){

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
      var query = this.options.params[0];
      activitySearchResultCollection.fetch({
        data: query,
        success: _.bind(function(collection){
          var html = this.template({
            activities: collection.toArray()
          });
          this.$el.html( html );
        }, this)
      });
    }
  });
  return View;

});

define([
  'zepto',
  'underscore',
  'backbone',
  'collections/activities',
  'text!templates/activity_stream.html'
], function module($, _, Backbone, activityCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(){
      activityCollection.on('add reset', function(activity){
        this.render();
      }, this);
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var limit = this.options.limit || 20,
          activities = activityCollection.last(limit),
          html;
      if(this.options.filter){
        activities = _.filter(activities, this.options.filter);
      }
      html = this.template({
        activities: activities
      });
      this.$el.html( html );
      return this;
    }
  });
  return View;

});

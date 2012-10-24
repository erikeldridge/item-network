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
          html = this.template({
            activities: activityCollection.last(limit)
          });
      this.$el.html( html );
      return this;
    }
  });
  return View;

});

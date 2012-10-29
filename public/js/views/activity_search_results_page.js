define([
  'underscore',
  'backbone',
  'collections/activities',
  'views/activity_stream',
  'text!templates/activity_search_results_page.html',
  'text!templates/activity_stream.html'
], function module(_, Backbone,
  activityCollection,
  ActivityStreamView,
  pageTemplate, streamTemplate){

  function formDecode(string){
    string = string || '';
    var params = {};
    _.each(string.split('&'), function(pairs){
      pairs = pairs.split('=').map(decodeURIComponent);
      params[pairs[0]] = pairs[1];
    });
    return params;
  }

  var View = Backbone.View.extend({
    template: _.template( pageTemplate ),
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var query = this.options.params[0],
          html = this.template(),
          stream = new ActivityStreamView();
      this.$el.html( html );
      this.$('.activity-stream').html(stream.render().el);
      activityCollection.fetch({
        data: query,
        add: true
      });
      this.on('remove', function(){
        stream.remove();
      });
    }
  });
  return View;

});

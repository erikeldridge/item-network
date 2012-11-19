define([
  'underscore',
  'backbone',
  'collections/activities',
  'views/stream',
  'views/layout',
  'text!templates/activity_search_results_page.html',
  'text!templates/user_activity_stream.html'
], function module(_, Backbone,
  activityCollections,
  StreamView, LayoutView,
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
          params = formDecode(query);

      var layout = new LayoutView({
        page: this.template()
      });
      this.$el.html( layout.el );

      var key = 'home';
      if(params.user_id){
        key = 'user_'+params.user_id;
      }else if(params.item_id){
        key = 'item_'+params.item_id;
      }else if(params.comment_id){
        key = 'comment_'+params.comment_id;
      }

      var activityCollection = activityCollections.get(key);
      activityCollection.fetch({
        data: query
      });
      var stream = new StreamView({
        template: streamTemplate,
        collection: activityCollection
      });
      this.$('.activity-stream').html(stream.render().el);

      activityCollection.fetch({
        data: query,
        add: true
      });
      this.on('remove', function(){
        layout.remove();
        stream.remove();
      });
    }
  });
  return View;

});

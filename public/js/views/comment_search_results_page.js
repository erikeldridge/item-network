define([
  'underscore',
  'backbone',
  'collections/comments',
  'views/layout',
  'views/stream',
  'text!templates/comment_search_results_page.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone,
  commentCollection,
  LayoutView, StreamView,
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
          params = formDecode(query),
          name = params.name || '',
          re = new RegExp(name),
          that = this,
          stream = new StreamView({
            template: streamTemplate,
            collection: commentCollection,
            filter: function(comment){
              var text = comment.get('name');
              return re.test(text);
            }
          });

      var layout = new LayoutView({
        page: this.template()
      });
      this.on('remove', layout.remove);
      this.$el.html( layout.el );

      this.$('.comment-stream').html(stream.render().el);
      commentCollection.fetch({
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

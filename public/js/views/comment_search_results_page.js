define([
  'underscore',
  'backbone',
  'collections/comments',
  'views/layout',
  'views/stream',
  'text!templates/comment_search_results_page.html',
  'text!templates/user_activity_stream.html'
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
          re = new RegExp(params.text || ''),
          that = this,
          stream = new StreamView({
            template: streamTemplate,
            collection: commentCollection,
            filter: function(comment){
              if(params.text){
                var text = comment.get('text');
                return re.test(text);
              }else if(params.owner_id){
                return comment.get('owner_id') == params.owner_id;
              }
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

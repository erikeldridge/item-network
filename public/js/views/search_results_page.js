define([
  'underscore',
  'backbone',
  'collections/comments',
  'collections/users',
  'collections/items',
  'views/layout',
  'views/stream',
  'text!templates/search_results_page.html',
  'text!templates/item_search_results.html',
  'text!templates/user_search_results.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone,
  commentCollection, userCollection, itemCollection,
  LayoutView, StreamView,
  template, itemSearchResultsTemplate, userSearchResultsTemplate, commentSearchResultsTemplate){

  function formDecode(string){
    string = string.replace(/\+/g, '%20') || '';
    var params = {};
    _.each(string.split('&'), function(pairs){
      pairs = pairs.split('=').map(decodeURIComponent);
      params[pairs[0]] = pairs[1];
    });
    return params;
  }

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
      var query = this.options.params[0],
          params = formDecode(query),
          name = params.name || '',
          re = new RegExp(name),
          itemStream,
          userStream,
          commentStream;

      var layout = new LayoutView({
        page: this.template()
      });
      this.on('remove', layout.remove);
      this.$el.html( layout.el );

      // item stream
      itemStream = new StreamView({
        template: itemSearchResultsTemplate,
        collection: itemCollection,
        filter: function(item){
          var text = item.get('name');
          return re.test(text);
        }
      });
      itemCollection.fetch({
        data: query,
        add: true
      });
      this.$('.item-stream').html(itemStream.render().el);

      // user stream
      userStream = new StreamView({
        template: userSearchResultsTemplate,
        collection: userCollection,
        filter: function(user){
          var text = user.get('name');
          return re.test(text);
        }
      });
      userCollection.fetch({
        data: query,
        add: true
      });
      this.$('.user-stream').html(userStream.render().el);

      // comment stream
      commentStream = new StreamView({
        template: commentSearchResultsTemplate,
        collection: commentCollection,
        filter: function(comment){
          var text = comment.get('text');
          return re.test(text);
        }
      });
      commentCollection.fetch({
        data: query,
        add: true
      });
      this.$('.comment-stream').html(commentStream.render().el);
      this.on('remove', function(){
        commentStream.remove()
        userStream.remove()
        itemStream.remove()
      });
    }
  });
  return View;

});

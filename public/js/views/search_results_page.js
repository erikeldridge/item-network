define([
  'underscore',
  'backbone',
  'collections/item_search_results',
  'collections/user_search_results',
  'collections/comment_search_results',
  'collections/comments',
  'collections/users',
  'collections/items',
  'views/stream',
  'text!templates/search_results_page.html',
  'text!templates/item_search_results.html',
  'text!templates/user_search_results.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone,
  itemSearchResultCollection, userSearchResultCollection, commentSearchResultCollection,
  commentCollection, userCollection, itemCollection,
  StreamView,
  template, itemSearchResultsTemplate, userSearchResultsTemplate, commentSearchResultsTemplate){

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
          re = new RegExp(name);

      var html = this.template();
      this.$el.html( html );

      // item stream
      var items = itemCollection.filter(function(item){
            var text = item.get('name');
            return re.test(text);
          }),
          itemStream;
      itemSearchResultCollection.reset(items);
      itemSearchResultCollection.fetch({
        data: query
      });
      itemStream = new StreamView({
        template: itemSearchResultsTemplate,
        collection: itemSearchResultCollection
      });
      this.on('remove', itemStream.remove);
      this.$('.item-stream').html(itemStream.render().el);

      // user stream
      var users = userCollection.filter(function(user){
            var text = user.get('name');
            return re.test(text);
          }),
          userStream;
      userSearchResultCollection.reset(users);
      userSearchResultCollection.fetch({
        data: query
      });
      userStream = new StreamView({
        template: userSearchResultsTemplate,
        collection: userSearchResultCollection
      });
      this.on('remove', userStream.remove);
      this.$('.user-stream').html(userStream.render().el);

      // comment stream
      var comments = commentCollection.filter(function(comment){
            var text = comment.get('text');
            return re.test(text);
          }),
          commentStream;
      commentSearchResultCollection.reset(comments);
      commentSearchResultCollection.fetch({
        data: query
      });
      commentStream = new StreamView({
        template: commentSearchResultsTemplate,
        collection: commentSearchResultCollection
      });
      this.on('remove', commentStream.remove);
      this.$('.comment-stream').html(commentStream.render().el);
    }
  });
  return View;

});

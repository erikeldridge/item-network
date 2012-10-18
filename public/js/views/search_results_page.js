define([
  'underscore',
  'backbone',
  'collections/item_search_results',
  'collections/user_search_results',
  'collections/comment_search_results',
  'text!templates/search_results_page.html',
  'text!templates/item_search_results.html',
  'text!templates/user_search_results.html',
  'text!templates/comment_search_results.html'
], function module(_, Backbone,
  itemSearchResultCollection, userSearchResultCollection, commentSearchResultCollection,
  template, itemSearchResultsTemplate, userSearchResultsTemplate, commentSearchResultsTemplate){

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

      var html = this.template();
      this.$el.html( html );

      itemSearchResultCollection.fetch({
        data: query,
        success: _.bind(function(results){
          var html = _.template(itemSearchResultsTemplate, {
            items: results
          });
          this.$('.item-search-results').html( html );
        }, this)
      });
      userSearchResultCollection.fetch({
        data: query,
        success: _.bind(function(results){
          var html = _.template(userSearchResultsTemplate, {
            users: results
          });
          this.$('.user-search-results').html( html );
        }, this)
      });
      commentSearchResultCollection.fetch({
        data: query,
        success: _.bind(function(results){
          var html = _.template(commentSearchResultsTemplate, {
            comments: results
          });
          this.$('.comment-search-results').html( html );
        }, this)
      });
    }
  });
  return View;

});

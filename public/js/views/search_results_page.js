define([
  'underscore',
  'backbone',
  'collections/search_results',
  'text!templates/search_results_page.html'
], function module(_, Backbone, searchResultsCollection, template){

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
      searchResultsCollection.fetch({
        data: query,
        success: _.bind(function(results){
          var html = this.template({
            results: results
          });
          this.$el.html( html );
        }, this)
      });

    }
  });
  return View;

});

define([
  'underscore',
  'backbone',
  'collections/item_search_results',
  'text!templates/search_results_page.html'
], function module(_, Backbone, itemSearchResultCollection, template){

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
      itemSearchResultCollection.fetch({
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

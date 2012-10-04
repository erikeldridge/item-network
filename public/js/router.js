define([
  'zepto',
  'backbone',
  'collections/items',
  'collections/users',
  'collections/likes',
  'views/create_item_page',
  'views/show_item_page',
  'views/show_items_page',
  'views/search_form_page',
  'views/search_results_page'
], function(
  $, Backbone, itemCollection, userCollection, likeCollection,
  CreateItemPageView, ShowItemPageView, ShowItemsPageView,
  SearchFormPageView, SearchResultsPageView){

  var views = {
        CreateItemPageView: CreateItemPageView,
        ShowItemPageView: ShowItemPageView,
        ShowItemsPageView: ShowItemsPageView,
        SearchFormPageView: SearchFormPageView,
        SearchResultsPageView: SearchResultsPageView,
      },
      Router = Backbone.Router.extend({
        routes: {
          '': 'CreateItemPageView',
          'item/:itemId': 'ShowItemPageView',
          'items': 'ShowItemsPageView',
          'search_form': 'SearchFormPageView',
          'search?*query': 'SearchResultsPageView'
        },
        initialize: function(){

          Backbone.history.on('route', function(router, viewName, params){
            if(this.view){
              this.view.close();
            }
            this.view = new views[viewName]({params: params});
            $('#container').html(this.view.el);
          }, this);

          // Internally handle anchor clicks if route is defined
          $(document).delegate('a', 'click', function(e){
            var route = e.target.getAttribute('href').replace(/^\//, '');
            Backbone.history.navigate(route, {trigger: true});
            return false;
          });

        }
      });

  return Router;

});

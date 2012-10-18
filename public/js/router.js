define([
  'zepto',
  'backbone',
  'views/layout',
  'views/nav_page',
  'views/create_item_page',
  'views/edit_item_page',
  'views/show_item_page',
  'views/search_form_page',
  'views/search_results_page',
  'views/show_user_page',
  'views/show_comment_page',
  'views/comment_search_results_page',
  'views/activity_search_results_page',
], function(
  $, Backbone,
  LayoutView, NavPageView,
  CreateItemPageView, EditItemPageView, ShowItemPageView,
  SearchFormPageView, ItemSearchPageView, ShowUserPageView,
  ShowCommentPageView, CommentSearchResultsPageView, ActivitySearchPageView){

  var Router = Backbone.Router.extend({
        routes: {
          ''                  : NavPageView,
          'create'            : CreateItemPageView,
          'edit_item/:id'     : EditItemPageView,
          'items/:id'          : ShowItemPageView,
          'items?*query'       : ItemSearchPageView,
          'items'              : ItemSearchPageView,
          'search_form'       : SearchFormPageView,
          'users/:id'          : ShowUserPageView,
          'comments/:id'       : ShowCommentPageView,
          'comments?*query'    : CommentSearchResultsPageView,
          'comments'           : CommentSearchResultsPageView,
          'activities?*query'   : ActivitySearchPageView,
          'activities'          : ActivitySearchPageView
        },
        initialize: function(){
          var layout = new LayoutView();
          $('#container').html(layout.el);
          Backbone.history.on('route', function(router, viewClass, params){
            if(this.view){
              this.view.remove();
            }
            this.view = new viewClass({
              params: params
            });
            layout.$('#page').html(this.view.el);
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

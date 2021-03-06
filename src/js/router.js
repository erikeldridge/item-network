define([
  'zepto', 'backbone',
  'views/layout', 'views/home_page', 'views/nav_page',
  'views/create_item_page', 'views/edit_item_page', 'views/show_item_page',
  'views/search_form_page', 'views/search_results_page',
  'views/show_user_page', 'views/user_search_results_page',
  'views/show_comment_page', 'views/logout_page', 'views/login_page',
  'views/item_search_results_page', 'views/comment_search_results_page', 'views/activity_search_results_page',
  'views/signup_page'
], function(
  $, Backbone,
  LayoutView, HomePageView, NavPageView,
  CreateItemPageView, EditItemPageView, ShowItemPageView,
  SearchFormPageView, SearchResultsPageView,
  ShowUserPageView, UserSearchResultsPageView,
  ShowCommentPageView, LogoutPageView, LoginPageView,
  ItemSearchResultsPageView, CommentSearchResultsPageView, ActivitySearchPageView,
  SignupPageView){

  var Router = Backbone.Router.extend({
        routes: {
          ''                  : HomePageView,
          'signup'            : SignupPageView,
          'logout'            : LogoutPageView,
          'login'             : LoginPageView,
          'nav'               : NavPageView,
          'create'            : CreateItemPageView,
          'edit_item/:id'     : EditItemPageView,
          'items/:id'         : ShowItemPageView,
          'items?*query'      : ItemSearchResultsPageView,
          'items'             : ItemSearchResultsPageView,
          'users/:id'         : ShowUserPageView,
          'users?*query'      : UserSearchResultsPageView,
          'users'             : UserSearchResultsPageView,
          'comments/:id'      : ShowCommentPageView,
          'comments?*query'   : CommentSearchResultsPageView,
          'comments'          : CommentSearchResultsPageView,
          'activities?*query' : ActivitySearchPageView,
          'activities'        : ActivitySearchPageView,
          'search'            : SearchResultsPageView,
          'search?*query'     : SearchResultsPageView,
          'search_form'       : SearchFormPageView
        },
        initialize: function(){
          Backbone.history.on('route', function(router, viewClass, params){
            if(this.view){
              this.view.remove();
            }
            this.view = new viewClass({
              params: params
            });
            $('body').html(this.view.el);
          }, this);

          // Internally handle anchor clicks if route is defined
          $(document).delegate('a', 'click', function(e){
            var route = e.currentTarget.getAttribute('href').replace(/^\//, '');
            Backbone.history.navigate(route, {trigger: true});
            return false;
          });

        }
      });

  return Router;

});

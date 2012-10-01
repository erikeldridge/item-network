define([
  'zepto',
  'backbone',
  'collections/items',
  'collections/users',
  'collections/likes',
  'views/create_item_page'
], function(
  $, Backbone, itemCollection, userCollection, likeCollection, CreateItemPageView){

  var views = {
        createItem : CreateItemPageView
      },
      Router = Backbone.Router.extend({
        routes: {
          '' : 'createItem'
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

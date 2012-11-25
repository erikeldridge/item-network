define([
  'underscore', 'backbone',
  'collections/sessions',
  'views/layout',
  'text!templates/logout_page.html'
], function module(_, Backbone,
  sessionCollection,
  LayoutView,
  pageTemplate){

  var View = Backbone.View.extend({
      template: _.template( pageTemplate ),
      initialize: function(){
        sessionCollection.first().destroy({complete: _.bind(this.render, this)});
      },
      remove: function(){
        this.trigger('remove');
        Backbone.View.prototype.remove.call(this);
        this.off();
      },
      render: function(xhr, status){
        var layout = new LayoutView({
          page: this.template()
        });
        this.$el.html( layout.el );

        this.on('remove', function(){
          layout.remove();
        });
      }
    });
  return View;

});

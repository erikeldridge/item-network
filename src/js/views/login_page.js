define([
  'underscore', 'backbone',
  'collections/sessions',
  'views/layout',
  'text!templates/login_page.html'
], function module(_, Backbone,
  sessionCollection,
  LayoutView,
  pageTemplate){

  var View = Backbone.View.extend({
      template: _.template( pageTemplate ),
      events: {
        'submit form': 'createSession'
      },
      createSession: function(e){
        var $form = $(e.target),
            data = {},
            opts = {};
        $form.find('input').each(function(i, el){
          data[el.name]=el.value;
        });
        opts.success = function(session){
          Backbone.history.navigate('/', {trigger: true});
        };
        sessionCollection.create(data, opts);
        return false;
      },
      initialize: function(){
        this.render();
      },
      remove: function(){
        this.trigger('remove');
        Backbone.View.prototype.remove.call(this);
        this.off();
      },
      render: function(){
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

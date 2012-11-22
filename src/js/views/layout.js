define([
  'backbone',
  'text!templates/layout.html'
], function module(Backbone, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit .navbar-search': 'search'
    },
    search: function(e){
      var query = this.$('.navbar-search').serialize();
      Backbone.history.navigate('search?'+query, {trigger: true});
      return false;
    },
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template(this.options);
      this.$el.html( html );
    }
  });
  return View;

});

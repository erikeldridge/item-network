define([
  'underscore',
  'backbone',
  'text!templates/search_form_page.html'
], function module(_, Backbone, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'submit'
    },
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template();
      this.$el.html( html );
    },
    submit: function(e){
      var query = this.$('.form').serialize();
      Backbone.history.navigate('search?'+query, {trigger: true});
      return false;
    }
  });
  return View;

});

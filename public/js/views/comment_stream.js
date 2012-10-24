define([
  'zepto',
  'underscore',
  'backbone',
  'text!templates/comment_stream.html'
], function module($, _, Backbone, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    initialize: function(options){
      options.collection.on('add reset', function(){
        this.render();
      }, this);
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var limit = this.options.limit || 20,
          html = this.template({
            collection: this.collection.last(limit)
          });
      this.$el.html( html );
      return this;
    }
  });
  return View;

});

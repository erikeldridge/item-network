define([
  'zepto',
  'underscore',
  'backbone',
  'collections/comments',
  'text!templates/comment_form.html'
], function module($, _, Backbone, commentCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'save',
    },
    save: function(e){
      var $input = this.$('input'),
          comment = {
            text: $input.val()
          };
      commentCollection.on('sync', function(){
        $input.val('');
      }, this);
      commentCollection.create(comment);
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
      var html = this.template();
      this.$el.html( html );
    }
  });
  return View;

});

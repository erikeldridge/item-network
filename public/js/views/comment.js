define([
  'zepto',
  'underscore',
  'backbone',
  'text!templates/comment.html'
], function module($, _, Backbone, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'click .remove': 'remove',
      'click .text': 'edit',
      'blur input': 'save',
    },
    edit: function(e){
      var $input = $('<input value="'+this.options.comment.get('text')+'" type="text">');
      this.$('.text').replaceWith($input);
      $input.focus();
    },
    save: function(e){
      var $input = this.$('input'),
          text = $input.val();
      this.options.comment.save({text:text});
      $input.replaceWith('<span class="text">'+text+'</span>');
    },
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.options.comment.destroy();
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
        comment: this.options.comment
      });
      this.$el.html( html );
    }
  });
  return View;

});

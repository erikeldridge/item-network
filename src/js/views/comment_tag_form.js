define([
  'underscore',
  'backbone',
  'collections/comment_tags',
  'text!templates/comment_tag_form.html'
], function module(_, Backbone, commentTagCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'save'
    },
    save: function(e){
      var $form = $(e.target),
          tag = {
            text: $form.find('input').val(),
            comment_id: this.options.comment.get('id')
          };
      commentTagCollection.create(tag);
      return false;
    },
    initialize: function(){
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template();
      this.$el.html( html );
      return this;
    }
  });
  return View;

});

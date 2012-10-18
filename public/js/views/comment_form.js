define([
  'zepto',
  'underscore',
  'backbone',
  'collections/comments',
  'views/typeahead_input',
  'text!templates/comment_form.html'
], function module($, _, Backbone, commentCollection, TypeaheadInputView, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': function(){return false;} // ignore form submission
    },
    save: function(comment){
      commentCollection.create(comment);
    },
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template(),
          typeaheadInput = new TypeaheadInputView();
      this.$el.html( html );
      typeaheadInput.on('return', this.save);
      this.on('remove', typeaheadInput.remove);
      this.$('.typeahead-input').append(typeaheadInput.el);
    }
  });
  return View;

});

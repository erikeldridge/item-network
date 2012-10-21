define([
  'zepto',
  'underscore',
  'backbone',
  'collections/comments',
  'collections/items',
  'collections/item_mentions',
  'views/typeahead/input',
  'text!templates/comment_form.html'
], function module($, _, Backbone,
  commentCollection, itemCollection, itemMentionCollection,
  TypeaheadInputView, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': function(){return false;} // ignore form submission
    },
    save: function(input){
      var text = _.pluck(input.phrases, 'text').join(' ');
      commentCollection.create({text: text}, {success: function(comment){
        _.each(input.phrases, function(phrase){
          var modelId = phrase.get('model_id') || '',
              matches = modelId.match(/([^-]+)-(\d+)/) || [];
          if('item' === matches[1]){
            itemMentionCollection.create({
              comment_id: comment.get('id'),
              item_id: parseInt(matches[2], 10)
            });
          }
        });
      }});
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

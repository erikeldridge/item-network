define([
  'underscore',
  'backbone',
  'collections/typeahead/suggestions',
  'collections/typeahead/phrases',
  'text!templates/typeahead/suggestions.html'
], function module(_, Backbone, suggestionCollection, phraseCollection, template){

  var View = Backbone.View.extend({
        template: _.template(template),
        events: {
          'click .suggestion': 'select'
        },
        initialize: function(){
          suggestionCollection.on('add reset', this.render, this);
        },
        remove: function(){
          this.undelegateEvents();
          Backbone.View.prototype.remove.call(this);
        },
        select: function(e){
          this.trigger('select');
          var $target = $(e.target),
              modelId = $target.data('model-id'),
              suggestion = suggestionCollection.where({model_id: modelId})[0];
          phraseCollection.push(suggestion.toJSON());
          suggestionCollection.reset();
        },
        render: function(){
          var html = this.template({
            suggestions: suggestionCollection.toArray()
          });
          this.$el.html( html );
          return this;
        }
      });

  return View;

});

define([
  'underscore',
  'backbone',
  'collections/typeahead/suggestions',
  'text!templates/typeahead/suggestions.html'
], function module(_, Backbone, collection, template){

  var View = Backbone.View.extend({
        template: _.template(template),
        events: {
          'click .suggestion': 'select'
        },
        initialize: function(){
          collection.on('add reset', this.render, this);
          this.render();
        },
        remove: function(){
          this.undelegateEvents();
          Backbone.View.prototype.remove.call(this);
        },
        select: function(e){
          this.trigger('select');
          var $target = $(e.target),
              modelId = $target.data('model-id'),
              suggestion = collection.where({model_id: modelId})[0];
          collection.push(suggestion.toJSON());
          collection.reset();
        },
        render: function(){
          var html = this.template({
            suggestions: collection.toArray()
          });
          this.$el.html( html );
          return this;
        }
      });

  return View;

});

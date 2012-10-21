define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/users',
  'text!templates/typeahead_suggestions.html',
  'text!templates/typeahead_input.html'
], function module(_, Backbone,
  itemCollection, userCollection,
  typeaheadSuggestionsTemplate, typeaheadInputTemplate){

  var suggestionCollection = new Backbone.Collection(),
      phraseCollection = new Backbone.Collection();

  var DraftView = Backbone.View.extend({
        initialize: function(){
          phraseCollection.on('add remove', this.render, this);
          this.render();
        },
        remove: function(){
          this.undelegateEvents();
          Backbone.View.prototype.remove.call(this);
        },
        render: function(){
          var text = phraseCollection.pluck('text').join(' ');
          this.$el.html( text );
          return this;
        }
      });

  var SuggestionsView = Backbone.View.extend({
        template: _.template(typeaheadSuggestionsTemplate),
        events: {
          'click .suggestion': 'select'
        },
        initialize: function(){
          suggestionCollection.on('add reset', this.render, this);
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

  var TypeaheadInputView = Backbone.View.extend({
    template: _.template( typeaheadInputTemplate ),
    events: {
      'keyup input': 'handleKey'
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
          suggestionsView = new SuggestionsView(),
          draftView = new DraftView();
      this.$el.html( html );
      this.$input = this.$('input');
      this.on('remove', suggestionsView.remove);
      this.on('remove', draftView.remove);
      this.$('.suggestions').html(suggestionsView.render().el);
      this.$('.draft').html(draftView.render().el);
      suggestionsView.on('select', function(){
        this.$input.val('').focus();
      }, this);
    },
    suggest: function(text){
      var name,
          re = new RegExp(text);
      suggestionCollection.reset();
      itemCollection.each(function(model){
        name = model.get('name');
        if(re.test(name)){
          suggestionCollection.add({
            model_id: 'item-'+model.get('id'),
            text: name
          });
        }
      });
      userCollection.each(function(model){
        name = model.get('name');
        if(re.test(name)){
          suggestionCollection.add({
            model_id: 'user-'+model.get('id'),
            text: name
          });
        }
      });
    },
    handleKey: function(e){
      var text = this.$input.val().replace(/^\s+|\s+$/g, ''),
          $draft = this.$('.draft');
      switch(e.keyCode){
        case 8: // backspace
          if(!text){
            phraseCollection.pop();
            suggestionCollection.reset();
          }
          break;
        case 13: // return
          if(text){
            phraseCollection.push({text: text});
          }
          this.$input.val('');
          this.trigger('return', {text: $draft.text()});
          $draft.empty();
          break;
        case 32: // space
          if(text){
            phraseCollection.push({text: text});
          }
          this.$input.val('');
          break;
        default:
          if(text){
            this.suggest(text);
          }
      }
    }
  });

  return TypeaheadInputView;

});

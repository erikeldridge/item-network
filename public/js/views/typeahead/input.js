define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/users',
  'collections/typeahead/phrases',
  'collections/typeahead/suggestions',
  'views/typeahead/draft',
  'views/typeahead/suggestions',
  'text!templates/typeahead/suggestions.html',
  'text!templates/typeahead/input.html'
], function module(_, Backbone,
  itemCollection, userCollection, phraseCollection, suggestionCollection,
  DraftView, SuggestionsView,
  typeaheadSuggestionsTemplate, typeaheadInputTemplate){

  var View = Backbone.View.extend({
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
            draftView = new DraftView();
        this.suggestionsView = new SuggestionsView();
        this.$el.html( html );
        this.$input = this.$('input');
        this.on('remove', this.suggestionsView.remove);
        this.on('remove', draftView.remove);
        this.$('.suggestions').html(this.suggestionsView.render().el);
        this.$('.draft').html(draftView.render().el);
        this.suggestionsView.on('select', function(){
          this.$input.focus().val('');
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
            this.trigger('return', {phrases: phraseCollection.toArray()});
            $draft.empty();
            phraseCollection.reset();
            break;
          case 32: // space
            if(text){
              phraseCollection.push({text: text});
            }
            this.$input.val('');
            break;
          case 38: // up
            this.suggestionsView.trigger('up');
            break;
          case 40: // down
            this.suggestionsView.trigger('down');
            break;
          default:
            if(text){
              this.suggest(text);
            }
        }
      }
    });

  return View;

});

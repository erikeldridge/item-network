define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/users',
  'text!templates/typeahead_suggestions.html',
  'text!templates/typeahead_input.html'
], function module(_, Backbone,
  itemCollection, userCollection,
  typeaheadSuggestionsTemplate, template){

  var suggestionCollection = new Backbone.Collection();

  var SuggestionView = Backbone.View.extend({
        template: _.template(typeaheadSuggestionsTemplate),
        render: function(){
          var html = this.template({
            suggestions: suggestionCollection.toArray()
          });
          this.$el.html( html );
          return this;
        }
      });

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'keyup input': 'dispatch'
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
      var suggestionView = new SuggestionView();
      suggestionCollection.on('add reset', function(){
        this.$('.suggestions').html(suggestionView.render().el);
      }, this);
    },
    dispatch: function(e){
      var text = e.target.value.replace(/^\s+|\s+$/g, '');
      if(!text && 8 === e.keyCode){// if input is empty, and we hit backspace, remove last phrase
        suggestionCollection.reset();
      }else if(text && 32 === e.keyCode){// on space, add word to phrase collection
      }else if(13 === e.keyCode){ // return
        this.compile();
      }else if(text){
        this.suggest(text);
      }
    },
    suggest: function(text){
      var name,
          re = new RegExp(text);
          itemCollection.each(function(model){
            name = model.get('name');
            if(re.test(name)){
              suggestionCollection.add({
                type: 'item',
                id: 'item-'+model.get('id'),
                text: name
              });
            }
          });
          userCollection.each(function(model){
            name = model.get('name');
            if(re.test(name)){
              suggestionCollection.add({
                type: 'user',
                id: 'user-'+model.get('id'),
                text: name
              });
            }
          });
    },
    compile: function(){
      var $input = this.$('input'),
          text = $input.val();
      if(text){
        this.phrases.push(text);
      }
      $input.val('');
      text = this.phrases.join(' '),
      this.trigger('return', {text: text});
      this.phrases = [];
      this.$('.phrases').empty();
    },
    select: function(e){
      var $target = $(e.target),
          text = $target.text().replace(/^\s+|\s+$/g, '');
      this.phrases.push(text);
      if('item' === $target.data('model')){
        this.selectedSuggestions.push(itemCollection.get($target.data('id')));
      }
      this.render();
      this.$('input').focus();
    },
  });
  return View;

});

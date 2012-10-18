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

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'keydown input': 'dispatch',
      'click .suggestion': 'select'
    },
    initialize: function(){
      this.render();
      this.phrases = [];
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
        phrases: this.phrases
      });
      this.$el.html( html );
    },
    dispatch: function(e){
      var text = e.target.value.replace(/^\s+|\s+$/g, '');
      if(!text && 8 === e.keyCode){// if input is empty, and we hit backspace, remove last phrase
        this.phrases.pop();
      }else if(text && 32 === e.keyCode){// on space, add word to phrase collection
        this.phrases.push(text);
        this.render();
        this.$('input').val('').focus();
      }else if(13 === e.keyCode){ // return
        this.compile();
      }else if(text){
        this.suggest(text);
      }
    },
    suggest: function(text){
      var name,
          re = new RegExp(text),
          items = itemCollection.filter(function(model){
            name = model.get('name');
            return re.test(name);
          }),
          users = userCollection.filter(function(model){
            name = model.get('name');
            return re.test(name);
          }),
          html = _.template(typeaheadSuggestionsTemplate, {
            items: items,
            users: users
          });
      this.$('.suggestions').html(html);
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
      var text = $(e.target).text().replace(/^\s+|\s+$/g, '');
      this.phrases.push(text);
      this.render();
      this.$('input').focus();
    },
  });
  return View;

});

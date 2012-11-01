define([
  'zepto',
  'underscore',
  'backbone',
  'collections/items',
  'collections/users',
  'collections/comments',
  'collections/typeahead/phrases',
  'collections/typeahead/suggestions',
  'views/typeahead/draft',
  'views/typeahead/suggestions',
  'text!templates/typeahead/suggestions.html',
  'text!templates/typeahead/input.html'
], function module($, _, Backbone,
  itemCollection, userCollection, commentCollection, phraseCollection, suggestionCollection,
  DraftView, SuggestionsView,
  suggestionsTemplate, inputTemplate){

  // http://snipplr.com/view/9649/escape-regular-expression-characters-in-string/
  RegExp.escape = function(str){
    var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
    return str.replace(specials, "\\$&");
  }

  var View = Backbone.View.extend({
    template: _.template(inputTemplate),
    events: {
      'keyup input': 'keyup',
      'click .suggestion': 'select',
    },
    keyup: function(e){
      switch(e.keyCode){
        case 32: // space
          // add
          if(e.target.value){
            var phrase = {
              text: e.target.value
            };
            phraseCollection.push(phrase);
            e.target.value = '';
          }
          break;
        case 8: // backspace
          if(!e.target.value && phraseCollection.length){
            var phrase = phraseCollection.pop();
            e.target.value = phrase.get('text');
          }
          // suggest
          suggestionCollection.reset();
          if(e.target.value && !this.isPlaceholder(e.target.value)){
            var val = RegExp.escape(e.target.value);
            itemCollection.each(function(item){
              var re = new RegExp(val),
                  name = item.get('name');
              if(re.test(name)){
                suggestionCollection.push({
                  text: '[item-'+item.get('id')+']'
                });
              }
            });
            userCollection.each(function(user){
              var re = new RegExp(val),
                  name = user.get('name');
              if(re.test(name)){
                suggestionCollection.push({
                  text: '[user-'+user.get('id')+']'
                });
              }
            });
          }
          break;
        case 13: // return
          // add
          if(e.target.value){
            var phrase = {
              text: e.target.value
            };
            phraseCollection.push(phrase);
            e.target.value = '';
          }
          var comment = this.options.comment || {};
          comment.text = phraseCollection.pluck('text').join(' ');
          commentCollection.create(comment, {wait:true});
          phraseCollection.reset();
          break;
        default:
          // suggest
          suggestionCollection.reset();
          if(e.target.value && !this.isPlaceholder(e.target.value)){
            var val = RegExp.escape(e.target.value);
            itemCollection.each(function(item){
              var re = new RegExp(val),
                  name = item.get('name');
              if(re.test(name)){
                suggestionCollection.push({
                  text: '[item-'+item.get('id')+']'
                });
              }
            });
            userCollection.each(function(user){
              var re = new RegExp(val),
                  name = user.get('name');
              if(re.test(name)){
                suggestionCollection.push({
                  text: '[user-'+user.get('id')+']'
                });
              }
            });
          }
      }
    },
    select: function(e){
      var $el = $(e.target),
          $input = this.$('input');
      var phrase = {
        text: $el.text(),
        model_id: $el.data('model-id')
      };
      phraseCollection.push(phrase);
      $input.focus().val('');
      suggestionCollection.reset();
    },
    isPlaceholder: function(str){
      return '[' === str[0];
    },
    initialize: function(){
      var that = this;
      phraseCollection.on('add remove reset', function(){
        that.$('.draft').html(this.pluck('text').join(' '));
      });
      suggestionCollection.on('add remove reset', function(){
        var html = _.template(suggestionsTemplate, {suggestions:this.toArray()});
        that.$('.suggestions').html(html);
      });
    },
    remove: function(){
      this.trigger('remove');
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

define([
  'zepto',
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/activities',
  'collections/items',
  'text!templates/nav_page.html',
  'text!templates/typeahead_suggestions.html',
], function module($, _, Backbone,
  userCollection, commentCollection, activityCollection, itemCollection,
  navPageTemplate, typeaheadSuggestionsTemplate){

  var View = Backbone.View.extend({
      template: _.template( navPageTemplate ),
      events: {
        'submit form': 'comment',
        'keyup input': 'typeahead',
        'click .suggestion': 'loadSuggestion'
      },
      comment: function(e){
        var $input = this.$('input[name="text"]'),
            text = $input.val(),
            owner = userCollection.get({id: 1}), // HACK: current user
            comment = {
              text: text
            };
        commentCollection.on('sync', function(){
          this.$('.alert-success').show();
          $input.val('');
        }, this);
        commentCollection.create(comment);
        return false;
      },
      typeahead: function(e){
        var text = e.target.value.replace(/^\s+|\s+$/g, ''),
            re = new RegExp(text);
        if(8 === e.keyCode){
          // on backspace, remove word from input
          this.$('.input .phrase:last').remove();
        }else if(text && 32 === e.keyCode){
          // on space, add word to input
          this.$('.input').append('<span class="phrase">'+text+'</span>');
          e.target.value = '';
        }else if(text){
          // if the text is non-blank, fetch suggestions
          var items = itemCollection.filter(function(model){
                var name = model.get('name');
                return re.test(name);
              }),
              users = userCollection.filter(function(model){
                var name = model.get('name');
                return re.test(name);
              }),
              html = _.template(typeaheadSuggestionsTemplate, {
                items: items,
                users: users
              });
          this.$('.typeahead-suggestions').html(html);
        }
      },
      loadSuggestion: function(e){
        var text = $(e.target).text().replace(/^\s+|\s+$/g, '');
        this.$('.input').append('<span class="phrase">'+text+'</span>');
        this.$('input').val('').focus();
        this.$('.typeahead-suggestions').empty();
      },
      initialize: function(){
        this.render();
      },
      remove: function(){
        this.undelegateEvents();
        Backbone.View.prototype.remove.call(this);
      },
      render: function(){
        var html = this.template({
          activities: activityCollection.first(3)
        });
        this.$el.html( html );
      }
    });
  return View;

});

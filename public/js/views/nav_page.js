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
        if(8 === e.keyCode){
          // on bakspace, remove word from input
          this.$('.input .phrase:last').remove();
        }else if(32 === e.keyCode){
          // on space, add word to input
          this.$('.input').append('<span class="phrase">'+e.target.value+'</span>');
          e.target.value = '';
        }else{
          var items = itemCollection.filter(function(model){
                var name = model.get('name'),
                    re = new RegExp(e.target.value);
                return re.test(name);
              }),
              users = userCollection.filter(function(model){
                var name = model.get('name'),
                    re = new RegExp(e.target.value);
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
        var text = $(e.target).text();
        this.$('.input').append('<span class="phrase">'+text+'</span>');
        this.$('input').val('');
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

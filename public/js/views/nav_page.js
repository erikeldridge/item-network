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
        'submit form': 'comment'
      },
      comment: function(e){
        var $input = this.$('input'),
            text = $input.val(),
            comment = {
              text: text
            };
        commentCollection.on('sync', function(model){
          var html = _.template('<a href="/comments/<%= id %>">Comment</a> posted', {id: model.get('id')})
          this.$('.alert-success').html(html).show();
          $input.val('');
        }, this);
        commentCollection.create(comment);
        return false;
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

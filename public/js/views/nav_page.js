define([
  'zepto',
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/activities',
  'collections/items',
  'views/comment_form',
  'text!templates/nav_page.html',
  'text!templates/typeahead_suggestions.html',
], function module($, _, Backbone,
  userCollection, commentCollection, activityCollection, itemCollection,
  CommentFormView,
  navPageTemplate, typeaheadSuggestionsTemplate){

  var View = Backbone.View.extend({
      template: _.template( navPageTemplate ),
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
        // comment form
        var commentForm = new CommentFormView();
        this.on('remove', commentForm.remove);
        this.$('.comment-form').append(commentForm.el);
      }
    });
  return View;

});

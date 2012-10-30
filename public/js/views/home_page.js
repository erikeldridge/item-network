define([
  'zepto',
  'underscore',
  'backbone',
  'collections/users',
  'collections/comments',
  'collections/activities',
  'collections/items',
  'views/comment_form',
  'views/activity_stream',
  'text!templates/home_page.html',
  'text!templates/typeahead_suggestions.html',
], function module($, _, Backbone,
  userCollection, commentCollection, activityCollection, itemCollection,
  CommentFormView, ActivityStreamView,
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
        var html = this.template();
        this.$el.html( html );
        // comment form
        var commentForm = new CommentFormView(),
            activityStream = new ActivityStreamView({
              limit: 3
            });
        this.on('remove', commentForm.remove);
        this.$('.comment-form').append(commentForm.el);
        // activity stream
        this.on('remove', activityStream.remove);
        this.$('.activity-stream').html(activityStream.render().el);
      }
    });
  return View;

});

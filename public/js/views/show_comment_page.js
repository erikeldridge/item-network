define([
  'underscore',
  'backbone',
  'collections/comments',
  'collections/comment_tags',
  'views/comment_tag',
  'text!templates/show_comment_page.html'
], function module(_, Backbone, commentCollection, commentTagCollection, CommentTagView, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'addTag'
    },
    addTag: function(e){
      var text = e.currentTarget.value;
      commentTagCollection.create({
        text: text,
        comment_id: this.comment.get('id')
      });
      return false;
    },
    initialize: function(options){
      var id = options.params[0];
      this.comment = commentCollection.get(id);
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
            comment: this.comment
          }),
          tags = commentTagCollection.where({comment_id: this.comment.get('id')});
      this.$el.html( html );
      _.each(tags, function(tag){
        var view = new CommentTagView({
          tag: tag
        });
        this.$('.tag-stream').append(view.el);
      }, this);
    }
  });
  return View;

});

define([
  'underscore',
  'backbone',
  'collections/comments',
  'views/comment_tag',
  'text!templates/show_comment_page.html'
], function module(_, Backbone, commentCollection, CommentTagView, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form': 'createTag'
    },
    createTag: function(e){
      var $input = this.$('input'),
          text = $input.val(),
          tag = commentTagCollection.create({
            text: text,
            comment_id: this.comment.get('id')
          }, {
            success: _.bind(this.appendTag, this)
          });
          $input.val('');
      return false;
    },
    appendTag: function(tag){
      var view = new CommentTagView({
        tag: tag
      });
      this.on('remove', view.remove);
      this.$('.tag-stream').append(view.el);
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
          });
          // tags = commentTagCollection.where({comment_id: this.comment.get('id')});
      this.$el.html( html );
      _.each(tags, this.appendTag, this);
    }
  });
  return View;

});

define([
  'underscore',
  'backbone',
  'collections/comments',
  'collections/items',
  'collections/users',
  'collections/comment_tags',
  'views/comment_tag_form',
  'views/stream',
  'text!templates/show_comment_page.html',
  'text!templates/comment_tag_stream.html'
], function module(_, Backbone,
  commentCollection, itemCollection, userCollection, tagCollection,
  CommentTagFormView, StreamView,
  showItemPageTemplate, tagStreamTemplate){

  var View = Backbone.View.extend({
    template: _.template( showItemPageTemplate ),
    initialize: function(options){
      var id = options.params[0];
      this.comment = commentCollection.get(id);
      this.render();
    },
    remove: function(){
      this.trigger('remove');
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var text = this.comment.get('text'),
          itemIds = text.match(/{item-(\d+)}/) || [],
          userIds = text.match(/{user-(\d+)}/) || [];
      text = text.replace(/{([^-]+-\d+)}/g, '<a data-model-id="$1"></a>');
      itemIds.shift();
      userIds.shift();
      var html = this.template({
            comment: this.comment,
            text: text
          });
      this.$el.html( html );

      _.each(itemIds, function(id){
        var item = itemCollection.get(id);
        this.$('a[data-model-id=item-'+id+']').attr('href', '/items/'+id).html(item.get('name'));
      }, this);
      _.each(userIds, function(id){
        var user = userCollection.get(id);
        this.$('a[data-model-id=user-'+id+']').attr('href', '/users/'+id).html(user.get('name'));
      }, this);
      // tag form
      var tagForm = new CommentTagFormView({
        comment: this.comment
      });
      this.$('.comment-tag-form').html(tagForm.render().el);
      tagCollection.on('add', function(){
        tagForm.$('input').val('');
      });
      // tag stream
      tagCollection.fetch({
        data: 'comment_id='+this.comment.get('id'),
        add: true
      });
      var that = this,
          tagStream = new StreamView({
            template: tagStreamTemplate,
            collection: tagCollection,
            filter: function(tag){
              return tag.get('comment_id') === that.comment.get('id');
            }
          });
      this.$('.comment-tag-stream').html(tagStream.render().el);
      this.on('remove', function(){
        tagForm.remove();
        tagStream.remove();
      });
    }
  });
  return View;

});

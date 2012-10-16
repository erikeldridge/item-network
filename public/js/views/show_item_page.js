define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/comments',
  'text!templates/show_item_page.html'
], function module(_, Backbone, itemCollection, commentCollection, template){

  var View = Backbone.View.extend({
    template: _.template( template ),
    events: {
      'submit form[name="comment"]': 'comment',
    },
    comment: function(e){
      var $input = this.$('input[name="text"]'),
          text = $input.val(),
          comment = {
            text: text
          };
      commentCollection.on('sync', function(comment){
        this.$('.comment-stream').prepend('<div class="comment"><a href="/comments/'+comment.get('id')+'">'+text+'</a></div>');
        $input.val('');
      }, this);
      commentCollection.create(comment);
      return false;
    },
    initialize: function(options){
      var id = options.params[0];
      this.item = itemCollection.get(id);
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var html = this.template({
          item: this.item
        });
      this.$el.html( html );
    }
  });
  return View;

});

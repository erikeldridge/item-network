/*
Host object config:
1) require module
2) extend object
3) define "this.likeableModelName"
4) define model named according to likeableModelName, e.g., "this.item"
5) map click event to likeHandler
*/
define([
  'zepto',
  'collections/likes'
], function($, likeCollection){
  return {
    likeHandler: function(e){
      var like = {},
          key = this.likeableModelName + '_id',
          opts = {};
      opts.success = function(){
        var $btn = $(e.currentTarget);
        $btn.addClass('btn-success unlike-button').removeClass('like-button')
        $btn.find('i').addClass('icon-white');
      };
      like[key] = this[this.likeableModelName].get('id'); // e.g., item_id => 1
      likeCollection.create(like, opts);
      return false;
    },
    unlikeHandler: function(e){
      var filter = {},
          key = this.likeableModelName + '_id',
          opts = {};
      opts.success = function(){
        var $btn = $(e.currentTarget);
        $btn.removeClass('btn-success unlike-button').addClass('like-button');
        $btn.find('i').removeClass('icon-white');
      };
      filter[key] = this[this.likeableModelName].get('id')
      var likes = likeCollection.where(filter);
      _.each(likes, function(like){
        like.destroy(opts);
      });
      return false;
    }
  };
});

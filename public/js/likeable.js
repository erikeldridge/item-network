/*
Host object config:
1) require module
2) extend object
3) define "this.likeableType"
4) define model named according to likeableType
5) map click event to likeHandler
*/
define([
  'zepto',
  'collections/likes'
], function($, likeCollection){
  return {
    likeHandler: function(e){
      var like = {},
          key = this.likeableType + '_id';
      like[key] = this[this.likeableType].get('id')
      likeCollection.on('sync', function(model){
        var $btn = $(e.currentTarget);
        $btn.addClass('btn-success');
        $btn.find('i').addClass('icon-white');
      }, this);
      likeCollection.create(like);
    }
  };
});

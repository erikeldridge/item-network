define([
  'underscore',
  'backbone',
  'collections/items',
  'views/stream',
  'text!templates/item_search_results.html',
  'text!templates/item_search_results_page.html',
], function module(_, Backbone,
  itemCollection,
  StreamView,
  streamTemplate, pageTemplate){

  function formDecode(string){
    string = string || '';
    var params = {};
    _.each(string.split('&'), function(pair){
      pair = pair.split('=').map(decodeURIComponent);
      params[pair[0]] = pair[1];
    });
    return params;
  }

  var View = Backbone.View.extend({
    template: _.template( pageTemplate ),
    initialize: function(){
      this.render();
    },
    remove: function(){
      this.undelegateEvents();
      Backbone.View.prototype.remove.call(this);
    },
    render: function(){
      var query = this.options.params[0],
          params = formDecode(query),
          name = params.name || '',
          re = new RegExp(name),
          html = this.template(),
          stream = new StreamView({
            template: streamTemplate,
            collection: itemCollection,
            filter: function(item){
              var text = item.get('name');
              return re.test(text);
            }
          });

      this.$el.html(html);
      itemCollection.fetch({
        data: query,
        add: true
      });
      this.$('.item-stream').html(stream.render().el);
      this.on('remove', stream.remove);
    }
  });
  return View;

});


define([
  'underscore',
  'backbone',
  'collections/items',
  'views/stream',
  'views/layout',
  'text!templates/item_search_results.html',
  'text!templates/item_search_results_page.html',
], function module(_, Backbone,
  itemCollection,
  StreamView, LayoutView,
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
      this.trigger('remove');
      Backbone.View.prototype.remove.call(this);
      this.off();
    },
    render: function(){
      var query = this.options.params[0],
          params = formDecode(query),
          name = params.name || '',
          re = new RegExp(name),
          stream = new StreamView({
            template: streamTemplate,
            collection: itemCollection,
            filter: function(item){
              var text = item.get('name');
              return re.test(text);
            }
          });

      var layout = new LayoutView({
        page: this.template()
      });
      this.$el.html( layout.el );

      itemCollection.fetch({
        data: query,
        add: true
      });
      this.$('.item-stream').html(stream.render().el);

      // clean up
      this.on('remove', function(){
        layout.remove();
        stream.remove();
      });
    }
  });
  return View;

});


define([
  'underscore',
  'backbone',
  'collections/items',
  'collections/item_search_results',
  'views/stream',
  'text!templates/item_search_results.html',
  'text!templates/item_search_results_page.html',
], function module(_, Backbone,
  itemCollection, itemSearchResultCollection,
  StreamView,
  itemSearchResultsTemplate, itemSearchResultsPageTemplate){

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
    template: _.template( itemSearchResultsPageTemplate ),
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
          items,
          itemStream;

      this.$el.html(html);

      items = itemCollection.filter(function(item){
        var text = item.get('name');
        return re.test(text);
      });
      itemSearchResultCollection.reset(items);
      itemSearchResultCollection.fetch({
        data: query
      });
      itemStream = new StreamView({
        template: itemSearchResultsTemplate,
        collection: itemSearchResultCollection
      });
      this.on('remove', itemStream.remove);
      this.$('.item-stream').html(itemStream.render().el);
    }
  });
  return View;

});


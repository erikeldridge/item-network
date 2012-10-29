define([
  'underscore',
  'backbone',
  'collections/users',
  'views/stream',
  'text!templates/user_search_results_page.html',
  'text!templates/user_search_results.html'
], function module(_, Backbone,
  userCollection,
  StreamView,
  pageTemplate, streamTemplate){

  function formDecode(string){
    string = string || '';
    var params = {};
    _.each(string.split('&'), function(pairs){
      pairs = pairs.split('=').map(decodeURIComponent);
      params[pairs[0]] = pairs[1];
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
            collection: userCollection,
            filter: function(user){
              var text = user.get('name');
              return re.test(text);
            }
          });
      this.$el.html( html );
      this.$('.user-stream').html(stream.render().el);
      userCollection.fetch({
        data: query,
        add: true
      });
      this.on('remove', function(){
        stream.remove();
      });
    }
  });
  return View;

});

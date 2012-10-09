// https://github.com/jcreamer898/RequireJS-Backbone-Starter
require.config({
  'paths': {
    'zepto': 'libs/jquery.min',
    "underscore": "libs/underscore-min",
    "backbone": "libs/backbone-min",
    "backbone-marionette": "libs/backbone-marionette",
    "bootstrap": "libs/bootstrap.min"
  },
  'shim': {
    backbone: {
      'deps': ['zepto', 'underscore'],
      'exports': 'Backbone'
    },
    'backbone-marionette': {
      'deps': ['backbone'],
      'exports': 'Backbone'
    },
    underscore: {
      'exports': '_'
    },
    zepto: {
      'exports': '$'
    },
    bootstrap: {
      'deps': ['zepto'],
      'exports': 'jQuery'
    }
  }
});

require(['app'], function(app){
  app.init();
});

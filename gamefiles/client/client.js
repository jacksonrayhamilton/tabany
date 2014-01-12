requirejs.config({
  // All scripts are loaded from gamefiles/ by default.
  baseUrl: 'gamefiles',
  paths: {
    // Uncomment minified scripts for production.
    jquery: [
      //'//code.jquery.com/jquery-1.10.2.min',
      //'client/lib/jquery-1.10.2.min',
      'client/lib/jquery-1.10.2'
    ],
    underscore: [
      //'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
      //'client/lib/underscore-min',
      'client/lib/underscore'
    ],
    moment: [
      //'//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.0/moment.min',
      //'client/lib/moment.min',
      'client/lib/moment'
    ],
    'socket.io': '/socket.io/socket.io',
    domReady: 'client/lib/domReady',
    text: 'shared/lib/text'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    'socket.io': {
      exports: 'io'
    }
  }
});

// Start the main client logic.
requirejs(['client/ClientGame'],
function (ClientGame) {
  
  'use strict';
  
  Object.create(ClientGame).init({
    setup: function () {
      
      var $container = this.sketch.$el;
      var containerOffset = $container.offset();
      $container.on('click', (function (event) {
        this.player.entity.x = event.pageX - Math.floor(containerOffset.left);
        this.player.entity.y = event.pageY - Math.floor(containerOffset.top);
        this.entitiesChanged = true;
      }).bind(this));
      
    }
  });
  
});

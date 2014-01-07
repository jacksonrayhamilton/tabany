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
    'socket.io': '/socket.io/socket.io',
    domReady: 'client/lib/domReady'
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
requirejs(['client/client']);

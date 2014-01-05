requirejs.config({
  // All scripts are loaded from lib/ by default.
  baseUrl: 'js/lib',
  paths: {
    // For a script at `public/js/app/script.js`, require it like so:
    // define(['app/script' ... ],
    // function (script ... ) {
    //   ...
    // });
    app: '../app',
    // Uncomment production scripts when needed.
    jquery: [
      //'//code.jquery.com/jquery-1.10.2.min',
      //'jquery-1.10.2.min',
      'jquery-1.10.2'
    ],
    underscore: [
      //'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
      //'underscore-min',
      'underscore'
    ],
    'socket.io': '/socket.io/socket.io'
  },
  shim: {
    underscore: {
      exports: '_'
    }
  }
});

// Start the main app logic.
requirejs(['app/main']);

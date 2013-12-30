requirejs.config({
  // All scripts are loaded from lib/ by default
  baseUrl: 'js/lib',
  paths: {
    // All scripts from app/ should be required like so: 'app/script'
    app: '../app',
    // Load libraries from cdn
    // REMEMBER TO REMOVE THE .js EXTENSION
    //jquery: '//code.jquery.com/jquery-1.10.2.min',
    jquery: 'jquery-1.10.2.min',
    //underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min'
  },
  shim: {
    underscore: {
      exports: '_'
    }
  }
});

// Start the main app logic.
requirejs(['app/main']);

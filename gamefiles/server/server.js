module.exports = function (server) {
  
  var requirejs = require('requirejs');
  
  requirejs.config({
    nodeRequire: require,
    baseUrl: './gamefiles',
    paths: {
      text: 'server/lib/text'
    }
  });
  
  // Start main server-side app logic.
  requirejs(['server/main'], function (main) {
    main(server);
  });
  
};

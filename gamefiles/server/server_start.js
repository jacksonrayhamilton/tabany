module.exports = function (httpServer) {
  
  var requirejs = require('requirejs');
  
  requirejs.config({
    nodeRequire: require,
    baseUrl: './gamefiles',
    paths: {
      text: 'server/lib/text'
    }
  });
  
  // Start main server logic.
  requirejs(['server/server'], function (server) {
    server(httpServer);
  });
  
};

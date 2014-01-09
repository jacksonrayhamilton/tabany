module.exports = function (httpServer) {
  
  var requirejs = require('requirejs');
  
  requirejs.config({
    nodeRequire: require,
    baseUrl: './gamefiles',
    paths: {
      text: 'shared/lib/text'
    }
  });
  
  // Start main server logic.
  requirejs(['server/ServerGame'], function (ServerGame) {
    Object.create(ServerGame).init(httpServer);
  });
  
};

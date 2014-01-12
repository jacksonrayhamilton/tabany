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
  requirejs(['server/ServerGame', 'text!server/settings.json'],
  function (ServerGame, settings) {
    
    Object.create(ServerGame).init(httpServer, JSON.parse(settings));
      
  });
  
};

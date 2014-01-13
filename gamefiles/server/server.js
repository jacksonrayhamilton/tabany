/*
 * Sets requirejs config and kick-starts the game.
 * Uses an httpServer passed-down from app.
 * Also uses settings from settings.json.
 */

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
    
    'use strict';
    
    Object.create(ServerGame).init(httpServer, JSON.parse(settings));
      
  });
  
};

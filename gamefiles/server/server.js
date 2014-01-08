// TODO: Consider better alternatives to a main() function.
define(['socket.io', 'underscore',
        'shared/Player',
        'server/Chat', 'server/ServerGame'],
function (socketio, _,
          Player,
          Chat, ServerGame) {
  
  var server = function (httpServer) {
    Object.create(ServerGame).init(httpServer);
  };
  
  return server;
});

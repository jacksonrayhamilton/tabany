// TODO: Consider better alternatives to a main() function.
define(['socket.io', 'underscore', 'shared/Player'],
function (socketio, _, Player) {
  
  var spawnPlayer = function (socket) {
    var player = Object.create(Player).init(_.random(0, 639), _.random(0, 479));
    socket.emit('createPlayer', { player: player });
  };
  
  var server = function (httpServer) {
    var io;
    
    io = socketio.listen(httpServer);
    
    io.sockets.on('connection', function (socket) {
      var player;
      
      player = Object.create(Player).init(32, 32);
      
      socket.set('player', player, function () {
        socket.emit('playerRegistered', { player: player });
      });
      
      /*setInterval(function () {
        spawnPlayer(socket);
      }, 2000);*/
    });
  };
  
  return server;
});

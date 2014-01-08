// TODO: Consider better alternatives to a main() function.
define(['socket.io', 'underscore',
        'shared/Game', 'shared/Player',
        'server/Chat'],
function (socketio, _,
          Game, Player,
          Chat) {
  
  var getRandomPlayer = function () {
    return player = Object.create(Player).init(_.random(0, 639), _.random(0, 479));
  };
  
  var server = function (httpServer) {
    var game, io;
    
    game = Object.create(Game).init();
    io = socketio.listen(httpServer);
    
    io.sockets.on('connection', function (socket) {
      
      var player = getRandomPlayer(),
          chat = Object.create(Chat).init({
            io: io,
            socket: socket
          });
      
      socket.set('player', player, function () {
        // BAD DESIGN, ideally players should be linked securely by a session
        // or even an ID, and there should be no need to call addEntity
        // afterwards.
        socket.emit('playerJoined', {
          player: player,
          entities: game.entities
        });
        game.addEntity(player);
        socket.broadcast.emit('createPlayer', { player: player });
        chat.sendMessageToClients({
          name: 'Server',
          message: player.character.name + ' has joined.'
        });
      });
      
      /*setInterval(function () {
        io.sockets.emit('createPlayer', { player: getRandomPlayer() });
      }, 2000);*/
    });
  };
  
  return server;
});

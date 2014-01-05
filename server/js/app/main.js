// TODO: Consider better alternatives to a main() function.
define(['socket.io', 'app/Entity'],
function (socketio, Entity) {
  
  var main = function (server) {
    
    var io = socketio.listen(server);
    
    io.sockets.on('connection', function (socket) {
      var dude = Object.create(Entity).init(7 * 32, 8 * 32, 16, 16, 'gir', 'left', 5, 10)
      socket.emit('createEntity', { entity: dude.toJSON() });
      socket.on('my other event', function (data) {
        console.log(data);
      });
    });
    
  };
  
  return main;
});

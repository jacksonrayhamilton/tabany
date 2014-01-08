define(['underscore', 'socket.io',
        'shared/Game', 'shared/inherits', 'shared/Player',
        'server/Chat'],
function (_, socketio,
          Game, inherits, Player,
          Chat) {
  
  'use strict';
  
  var getRandomPlayer = function () {
    return player = Object.create(Player).init(_.random(0, 639), _.random(0, 479));
  };
  
  var ServerGame = inherits(Game, {
    
    init: function (applySuper, httpServer) {
      
      applySuper(this);
      
      // Preserve a reference to `this` to avoid needless binding and
      // improve readability.
      var game = this;
      
      game.playersPrivate = {};
      game.randomKeys = [];
      
      this.io = socketio.listen(httpServer);
      var io = this.io;
      io.sockets.on('connection', function (socket) {
        
        var chat = Object.create(Chat).init({
          io: io,
          socket: socket
        });
        
        var uuid = game.generateUUID();
        var key = game.generateKey();
        
        var player = Object.create(Player).init({
          uuid: uuid
        });
        player.generateRandomCharacter(
          _.random(0, 639),
          _.random(0, 479),
          (['left', 'up', 'right', 'down'])[_.random(0, 3)]
        );
        game.players[uuid] = player;
        game.playersPrivate[key] = player;
        
        socket.set('player', player, function () {
          
          game.addEntity(player.character);
          socket.emit('playerJoined', {
            players: game.players,
            uuid: uuid,
            key: key
            // entities: game.entities
            // other gamestate stuff goes here
          });
          
          socket.broadcast.emit('createPlayer', { player: player });
          
          chat.sendMessageToClients({
            name: 'Server',
            message: player.character.name + ' has joined.'
          });
          
        });
        
        socket.on('playerMove', game.onPlayerMove.bind(game));
        
      });
      
      return this;
    },
    
    // Source: http://stackoverflow.com/a/2117523/1468130
    generateUUID: (function () {
      var format, regex, callback;
      
      format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      regex = /[xy]/g;
      callback = function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      };
      
      return function () {
        return format.replace(regex, callback);
      };
    }()),
    
    // TODO: Use secure random service like random.org.
    // TODO: Just use sessions... or something...
    generateKey: function () {
      var key = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      do {
        for (var i = 0; i < 32; i++) {
          key += possible.charAt(Math.floor(Math.random() * possible.length));
        }
      } while (this.randomKeys.indexOf(key) > -1);
      this.randomKeys.push(key);
      return key;
    },
    
    onPlayerMove: function (data) {
      var player = this.playersPrivate[data.key];
      
      if (player) {
        // this.move();
        // TODO: Implement alg on todo list
        this.io.sockets.emit('playerMove', {
          uuid: player.uuid,
          direction: data.direction
        });
      }
    }
    
  });
  
  return ServerGame;
});

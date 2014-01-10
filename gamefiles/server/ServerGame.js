define(['underscore', 'socket.io',
        'shared/Game', 'shared/inherits', 'shared/Player',
        'server/Chat'],
function (_, socketio,
          Game, inherits, Player,
          Chat) {
  
  'use strict';
  
  var getRandomPlayer = function () {
    return Object.create(Player).init(_.random(0, 639), _.random(0, 479));
  };
  
  var ServerGame = inherits(Game, {
    
    init: function (applySuper, args) {
      
      applySuper(this);
      
      this.name = args.name || 'Server';
      this.color = args.color || 'rgb(17,17,17)';
      
      this.playersPrivate = {};
      this.keysInUse = [];
      
      this.chat = Object.create(Chat).init();
      
      this.io = socketio.listen(args.httpServer, {
        //log: false
      });
      
      this.io.sockets.on('connection', this.onConnection.bind(this));
      
      // To use socket.io sessions, bind this to the socket in onConnection instead.
      this.io.sockets.on('sendChatMessageToServer', this.onSendChatMessageToServer.bind(this));
      
      return this;
    },
    
    onConnection: function (socket) {
        
      var uuid = this.generateUUID();
      var key = this.generateKey();
      
      var player = Object.create(Player).init({
        uuid: uuid
      });
      this.playersPrivate[key] = player;
      player.generateRandomCharacter(
        _.random(0, 639),
        _.random(0, 479),
        (['left', 'up', 'right', 'down'])[_.random(0, 3)]
      );
      player.generateRandomColor();
      this.addPlayer(player);
      
      // TODO: Change split this up into a game payload and then create player
      // after.
      socket.emit('playerJoin', {
        serverInfo: {
          name: this.name,
          color: this.color
        },
        players: this.players,
        uuid: uuid,
        key: key
        // entities: game.entities
        // other gamestate stuff goes here
      });
      
      socket.broadcast.emit('createPlayer', { player: player });
      
      this.sendChatMessageToClients({
        identifier: this.name,
        message: player.character.name + ' has joined.'
      });
      
      socket.on('playerMove', this.onPlayerMove.bind(this));
      socket.on('sendChatMessageToServer', this.onSendChatMessageToServer.bind(this));
    },
    
    // You do NOT need keys! This is STUPID!
    // Use SESSIONS instead!
    validateKey: function (key, callback) {
      var player = this.playersPrivate[key];
      if (player) {
        callback.call(this, player);
      }
    },
    
    sendChatMessageToClients: function (data) {
      data.id = this.chat.getNextMessageId();
      this.io.sockets.emit('sendChatMessageToClient', data);
    },
    
    onSendChatMessageToServer: function (data) {
      if (this.chat.validateMessage(data.message)) {
        this.validateKey(data.key, function (player) {
          this.sendChatMessageToClients({
            identifier: player.uuid,
            message: data.message
          });
        });
      }
    },
    
    onPlayerMove: function (data) {
      this.validateKey(data.key, function (player) {
        // this.move();
        // TODO: Implement alg on todo list
        this.io.sockets.emit('playerMove', {
          uuid: player.uuid,
          direction: data.direction
        });
      });
    },
    
    // Source: http://stackoverflow.com/a/2117523/1468130
    generateUUID: (function () {
      var format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      var regex = /[xy]/g;
      var callback = function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      };
      return function () {
        return format.replace(regex, callback);
      };
    }()),
    
    // TODO: Use secure random service like random.org.
    // CONSIDER: Sessions?
    generateKey: (function () {
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return function () {
        var key = '';
        do {
          for (var i = 0; i < 32; i++) {
            key += possible.charAt(Math.floor(Math.random() * possible.length));
          }
        } while (this.keysInUse.indexOf(key) > -1);
        this.keysInUse.push(key);
        return key;
      };
    }())
    
  });
  
  return ServerGame;
});

define(['underscore', 'socket.io',
        'shared/Game', 'shared/inherits', 'shared/Player', 'shared/PlayerCharacter',
        'server/Chat'],
function (_, io,
          Game, inherits, Player, PlayerCharacter,
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
      
      this.entityCount = 0;
      
      this.chat = Object.create(Chat).init();
      
      this.io = io.listen(args.httpServer, {
        //log: false
      });
      
      /*this.io.set('authorization', function (handshakeData, callback) {
        callback(null, true);
      });*/
      
      this.io.sockets.on('connection', this.onConnection.bind(this));
      
      return this;
    },
    
    onConnection: function (socket) {
      
      var uuid = this.generateUUID();
      socket.set('uuid', uuid);
      
      var playerCharacter = PlayerCharacter.generateRandomCharacter(
        this.getNextEntityId(),
        _.random(0, 639),
        _.random(0, 479),
        (['left', 'up', 'right', 'down'])[_.random(0, 3)]
      );
      this.addEntity(playerCharacter);
      var player = this.createPlayer({
        uuid: uuid,
        character: playerCharacter
      });
      
      socket.emit('clientJoin', {
        serverInfo: {
          name: this.name,
          color: this.color
        },
        uuid: uuid,
        players: this.players,
        entities: this.entities
        // other gamestate stuff goes here
      });
      
      // Tell all other clients about the new player.
      socket.broadcast.emit('createPlayer', { player: player });
      
      this.sendChatMessageToClients({
        identifier: this.name,
        message: player.character.name + ' has joined.'
      });
      
      this.setSocketEvents(socket, {
        'movePlayer': this.onMovePlayer,
        'sendChatMessageToServer': this.onSendChatMessageToServer
      });
    },
    
    getNextEntityId: function () {
      var ret = this.entityCount;
      this.entityCount += 1;
      return ret;
    },
    
    // Gets the player associated with a socket and passes that player to
    // a socket event callback as the second argument.
    // The client can't be trusted and the socket knows his real identity, so
    // this function should hook into all client-initiated events.
    getSocketPlayer: function (socket, callback) {
      return function (data) {
        socket.get('uuid', (function (err, uuid) {
          if (err) throw err;
          callback(data, this.getPlayer(uuid));
        }).bind(this));
      };
    },
    
    // Sets a dictionary of event-callback pairs on a socket.
    setSocketEvents: function (socket, events) {
      _.each(events, function (callback, event) {
        socket.on(event, this.getSocketPlayer(socket, callback.bind(this)).bind(this));
      }, this);
    },
    
    sendChatMessageToClients: function (data) {
      data.id = this.chat.getNextMessageId();
      this.io.sockets.emit('sendChatMessageToClient', data);
    },
    
    onSendChatMessageToServer: function (data, player) {
      if (this.chat.validateMessage(data.message)) {
        this.sendChatMessageToClients({
          identifier: player.uuid,
          time: Date.now(),
          message: this.chat.censorMessage(data.message)
        });
      }
    },
    
    onMovePlayer: function (data, player) {
      // this.move();
      // TODO: Implement alg on todo list
      this.io.sockets.emit('movePlayer', {
        uuid: player.uuid,
        direction: data.direction
      });
    },
    
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
    }())
    
  });
  
  return ServerGame;
});

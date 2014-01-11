define(['underscore', 'socket.io',
        'shared/Entity', 'shared/Game', 'shared/inherits', 'shared/Player',
        'server/Chat'],
function (_, io,
          Entity, Game, inherits, Player,
          Chat) {
  
  'use strict';
  
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
      var uuid, player, entity;
      
      uuid = this.generateUUID();
      socket.set('uuid', uuid);
      
      player = this.createPlayer({
        uuid: uuid
      });
      player.generateRandomName();
      player.generateRandomEntity({
        id: this.getNextEntityId(),
        x: _.random(0, 639),
        y: _.random(0, 479),
        direction: (['left', 'up', 'right', 'down'])[_.random(0, 3)]
      });
      player.generateRandomColor();
      this.addEntity(player.entity);
      
      socket.emit('clientJoin', {
        serverInfo: {
          name: this.name,
          color: this.color
        },
        uuid: uuid,
        players: this.players,
        entities: this.entities,
        //tilesets: this.tilesets,
        //maps: this.maps
        // other gamestate stuff goes here
      });
      
      // Tell all other clients about the new player.
      socket.broadcast.emit('createPlayer', {
        entity: player.entity,
        player: player
      });
      
      this.sendChatMessageToClients({
        identifier: this.name,
        message: player.name + ' has joined.'
      });
      
      this.setSocketEvents(socket, {
        //'movePlayer': this.onMovePlayer,
        'sendChatMessageToServer': this.onSendChatMessageToServer,
        'startMovingContinuously': this.onStartMovingContinuously,
        'stopMovingContinuously': this.onStopMovingContinuously
      });
    },
    
    getNextEntityId: function () {
      var ret = this.entityCount;
      this.entityCount += 1;
      return ret;
    },
    
    // Gets the Player associated with a socket. Passes the socket and
    // Player to a socket event callback.
    // The client can't be trusted and the socket knows his real identity, so
    // this function should hook into all client-initiated events.
    getSocketPlayer: function (socket, callback) {
      return function (data) {
        socket.get('uuid', (function (err, uuid) {
          if (err) throw err;
          callback(data, socket, this.getPlayer(uuid));
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
    
    onSendChatMessageToServer: function (data, socket, player) {
      if (this.chat.validateMessage(data.message)) {
        this.sendChatMessageToClients({
          identifier: player.uuid,
          time: Date.now(),
          message: this.chat.censorMessage(data.message)
        });
      }
    },
    
    /*onMovePlayer: function (data, socket, player) {
      var success;
      success = this.move(player.entity, data.direction, this.currentMap);
      // TODO: Implement automatic map creation.
      // TODO: Implement alg on todo list
      socket.broadcast.emit('movePlayer', {
        uuid: player.uuid,
        direction: data.direction
      });
    },*/
    
    onStartMovingContinuously: function (data, socket, player) {
      socket.broadcast.emit('startMovingContinuously', {
        uuid: player.uuid,
        direction: data.direction
      });
    },
    
    onStopMovingContinuously: function (data, socket, player) {
      socket.broadcast.emit('stopMovingContinuously', {
        uuid: player.uuid
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

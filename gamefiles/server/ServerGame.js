define(['fs', 'underscore', 'socket.io',
        'shared/Entity', 'shared/Game', 'shared/inherits', 'shared/Player',
        'server/Chat'],
function (fs, _, io,
          Entity, Game, inherits, Player,
          Chat) {
  
  'use strict';
  
  var ServerGame = inherits(Game, {
    
    init: function (applySuper, httpServer, settings) {
      var tilesets, maps, name, data, i, len, tileset, map;
      
      applySuper(this);
      
      this.name = (typeof settings.name === 'undefined') ? 'Server' : settings.name;
      this.color = (typeof settings.color === 'undefined') ? 'rgb(17,17,17)' : settings.color;
      
      this.nextEntityId = 1;
      this.nextMapId = 1;
      
      this.chat = Object.create(Chat).init();
      
      tilesets = settings.tilesets;
      maps = settings.maps;
      
      // This is a STRING.
      this.startingMap = settings.startingMap;
      
      // TODO: Make async.
      for (i = 0, len = tilesets.length; i < len; i++) {
        name = tilesets[i];
        data = fs.readFileSync('.' + this.TILESETS_DIRECTORY + name + '.json', 'utf-8');
        tileset = this.createTileset(JSON.parse(data));
      }
      
      for (i = 0, len = maps.length; i < len; i++) {
        name = maps[i];
        data = fs.readFileSync('.' + this.MAPS_DIRECTORY + name + '.json', 'utf-8');
        map = this.createMap(JSON.parse(data));
      }
      
      // TODO: Keep track of a Player's current map because the server
      // should actually be able to manage multiple maps.
      this.currentMap = this.getMap(this.startingMap); // TESTING ONLY, remove soon!
      
      this.io = io.listen(httpServer, {
        log: false
      });
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
        startingMap: this.startingMap,
        players: this.players,
        entities: this.entities,
        tilesets: _.pluck(this.tilesets, 'name'),
        maps: _.pluck(this.maps, 'name')
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
      
      // TODO: This is a testing implementation, make it more effecient.
      setInterval((function () {
        if (this.entitiesChanged) {
          var entitiesSnapshot = this.entities.map(function (entity) {
            return entity.getSnapshot();
          });
          this.io.sockets.emit('entitiesSnapshot', entitiesSnapshot);
          this.entitiesChanged = false;
        }
      }).bind(this), 50);
    },
    
    getNextEntityId: function () {
      var ret = this.nextEntityId;
      this.nextEntityId += 1;
      return ret;
    },
    
    getNextMapId: function () {
      var ret = this.nextMapId;
      this.nextMapId += 1;
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
    
    startMovingContinuously: function (entity, direction, layeredMap) {
      var newDirection;
      newDirection = direction !== entity.direction;
      if (!entity.moving || newDirection) {
        entity.moving = true;
        if (newDirection) {
          clearTimeout(entity.movementTimeout);
        }
        this.moveContinuously(entity, direction, layeredMap);
      }
    },
    
    stopMovingContinuously: function (entity) {
      entity.moving = false;
    },
    
    onStartMovingContinuously: function (data, socket, player) {
      // currentMap should actually be the player's current map
      this.startMovingContinuously(player.entity, data.direction, this.currentMap);
      socket.broadcast.emit('startMovingContinuously', {
        uuid: player.uuid,
        direction: data.direction
      });
    },
    
    onStopMovingContinuously: function (data, socket, player) {
      this.stopMovingContinuously(player.entity);
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

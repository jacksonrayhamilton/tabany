define(['fs', 'underscore', 'socket.io',
        'shared/Entity', 'shared/Game', 'shared/inherits', 'shared/Player',
        'server/Chat'],
function (fs, _, io,
          Entity, Game, inherits, Player,
          Chat) {
  
  'use strict';
  
  /*
   * Manages the true state of the game. The big mac-daddy game to rule
   * all games. The sultan of swat. The king of crash. The colossus of clout.
   * The colossus of clout. THE GREAT BAMBINO.
   * 
   * In all seriousness:
   * - Maintains a list of Tileset and Map resources that are needed.
   * - Maintains all Maps.
   * - Maintains all Players and creates them.
   * - Sends and receives messages to and from clients.
   * - Broadcasts game data to clients on regular intervals to keep things
   *   in sync.
   */
  var ServerGame = inherits(Game, {
    
    // Millisecond delay for sending Entity snapshots.
    SNAPSHOT_RATE: 50,
    // Amount of snapshots to be sent before sending all Entity snapshots
    // (even ones not marked as having moved.)
    FORCE_SNAPSHOT_RATE: 20,
    
    init: function (applySuper, httpServer, settings) {
      var tilesets, maps, name, data, i, len, tileset, map;
      
      applySuper(this);
      
      // Cosmetic settings.
      this.name = (typeof settings.name === 'undefined') ? 'Server' : settings.name;
      this.color = (typeof settings.color === 'undefined') ? 'rgb(17,17,17)' : settings.color;
      
      this.nextEntityId = 1;
      
      this.chat = Object.create(Chat).init();
      
      // CONSIDER: Read files asynchronously?
      tilesets = settings.tilesets;
      maps = settings.maps;
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
      
      // The map that any newly-joining player is placed on.
      this.startingMap = this.getMap(settings.startingMap);
      
      this.io = io.listen(httpServer, {
        // Turn off logging for slightly improved performance.
        log: false
      });
      this.io.sockets.on('connection', this.onConnection.bind(this));
      
      this.sendSnapshotsConstantly();
      
      return this;
    },
    
    // TODO: Allow for returning clients to reclaim their old Players
    // rather than creating a new one each time. Perhaps use sessions for
    // this.
    // Handles new client connections. Creates an Player for them and
    // delivers information about the world that they can use to emuate
    // it locally.
    onConnection: function (socket) {
      var uuid, player, entity;
      
      // Create a uuid to associate with this client and his Player.
      uuid = this.generateUUID();
      socket.set('uuid', uuid);
      
      // Generate a random Player for this client to play with.
      player = this.createPlayer({
        uuid: uuid
      });
      player.generateRandomName();
      player.generateRandomEntity({
        id: this.getNextEntityId(),
        x: _.random(0, 639),
        y: _.random(0, 479),
        direction: (['left', 'up', 'right', 'down'])[_.random(0, 3)],
        currentMap: this.startingMap
      });
      player.generateRandomColor();
      this.addEntity(player.entity);
      
      // Give the client all the information needed to emulate the game world.
      // 
      // For Players and Entities, actual objects are sent.
      // For Tilesets and Maps, strings referring to their names are sent.
      // Those strings will be used to look up Tileset and Map objects 
      // that exist on the client-side.
      //
      // (The client can potentially get cached JSON files instead, and less 
      // information needs to be pushed through the socket.)
      socket.emit('clientJoin', {
        serverInfo: {
          name: this.name,
          color: this.color
        },
        uuid: uuid,
        players: this.players,
        entities: this.entities,
        tilesets: _.pluck(this.tilesets, 'name'),
        maps: _.pluck(this.maps, 'name')
      });
      
      // Tell all other clients about the new Player.
      socket.broadcast.emit('createPlayer', {
        entity: player.entity,
        player: player
      });
      
      // Setup callbacks for events.
      this.setSocketEvents(socket, {
        'clientJoinSuccess': this.onClientJoinSuccess,
        'sendChatMessageToServer': this.onSendChatMessageToServer,
        'startMovingContinuously': this.onStartMovingContinuously,
        'stopMovingContinuously': this.onStopMovingContinuously
      });
      
    },
    
    // After joining successfully, all clients (including the one who just
    // joined) will receive this message.
    onClientJoinSuccess: function (data, socket, player) {
      this.sendChatMessageToClients({
        identifier: this.name,
        message: player.name + ' has joined.'
      });
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
    
    onStartMovingContinuously: function (data, socket, player) {
      this.startMovingContinuously(player.entity, data.direction, player.entity.currentMap);
      socket.broadcast.emit('startMovingContinuously', {
        id: player.entity.id,
        direction: data.direction
      });
    },
    
    onStopMovingContinuously: function (data, socket, player) {
      this.stopMovingContinuously(player.entity);
      socket.broadcast.emit('stopMovingContinuously', {
        id: player.entity.id
      });
    },
    
    // Gets the Player associated with a socket. Passes the socket and
    // Player to a callback.
    // The client can't be trusted and the socket knows his real identity, so
    // this function should hook into all client-initiated events which
    // involve a Player.
    getSocketPlayer: function (socket, callback) {
      return function (data) {
        socket.get('uuid', (function (err, uuid) {
          if (err) throw err;
          callback(data, socket, this.getPlayer(uuid));
        }).bind(this));
      };
    },
    
    // Sets a dictionary of event-callback pairs on a socket.
    // A convenience method for this long-winded hooking and binding
    // process that would otherwise be rather repetitive.
    setSocketEvents: function (socket, events) {
      _.each(events, function (callback, event) {
        socket.on(event, this.getSocketPlayer(socket, callback.bind(this)).bind(this));
      }, this);
    },
    
    // Begins sending Entity snapshots to all clients, to account for client
    // error, lag etc. Will send snapshots of the Entities which have moved,
    // or regularly of all Entities (to account for packet loss).
    // TODO: This might still need to be made more efficient.
    // TODO: Modify client so they are more accurate. Then they might not
    // jump as much. The SNAPSHOT_RATE probably shouldn't change though.
    sendSnapshotsConstantly: function () {
      setInterval(((function () {
        var count = -1;
        return (function () {
          var force, i, len, entitiesSnapshot, entity;
          if (count === this.FORCE_SNAPSHOT_RATE) {
            force = true;
            count = 0;
          } else {
            count++;
          }
          if (this.entitiesChanged || force) {
            entitiesSnapshot = [];
            for (i = 0, len = this.entities.length; i < len; i++) {
              entity = this.entities[i];
              if (entity.changed || force) {
                entitiesSnapshot.push(entity.getSnapshot());
                entity.changed = false;
              }
            }
            this.io.sockets.emit('entitiesSnapshot', entitiesSnapshot);
            this.entitiesChanged = false;
          }
        }).bind(this);
      }).bind(this)()), this.SNAPSHOT_RATE);
    },
    
    // Integer ids differentiate Entities.
    getNextEntityId: function () {
      var ret = this.nextEntityId;
      this.nextEntityId += 1;
      return ret;
    },
    
    // UUIDs differentiate Players.
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

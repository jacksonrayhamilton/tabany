define(['jquery', 'socket.io', 'underscore',
        'shared/Game', 'shared/inherits',
        'text!shared/entity_images.json', 'text!shared/tileset_images.json', 
        'client/Chatbox', 'client/Input', 'client/Sketch',
        'client/polyfills'],
function ($, io, _,
          Game, inherits,
          entityImages, tilesetImages,
          Chatbox, Input, Sketch) {
  
  'use strict';
  
  /*
   * Manages the state of client's perception of the game.
   * Handles incoming and outgoing events.
   * Initiates drawing.
   * Handles client input.
   */
  var ClientGame = inherits(Game, {
    
    init: function (applySuper, args) {
      args = args || {};
      
      applySuper(this);
      
      this.$el = args.$el || (args.el ? $(args.el) : $('#game-container'));
      if (args.setup) this.setup = args.setup;
      
      this.player = null;
      
      this.sketch = Object.create(Sketch).init({
        entityImages: JSON.parse(entityImages),
        tilesetImages: JSON.parse(tilesetImages)
      });
      // TODO: Multiple canvases. These settings might be too arbitrary.
      // Then-again they might eventually have to be set in stone for
      // simplicity's sake.
      this.canvas = this.sketch.createCanvas('main', 640, 480);
      this.sketch.appendCanvas('main');
      
      // TODO: Maps might have animated tiles. tilesChanged  can be used
      // for cosmetic updates to the caches (redraw only changed tiles
      // onto the cache).
      //this.tilesChanged = [0, 5, 24];
      
      // Connect to the server! IT'S HAPPENING!
      this.socket = io.connect();
      this.socket.on('clientJoin', this.onClientJoin.bind(this));
      
      return this;
    },
    
    // Callback to process all information the server gives to the client after
    // joining the game.
    onClientJoin: function (data) {
      var i, len, player, map;
      
      this.serverInfo = data.serverInfo;
      
      // Load JSON data on all Tilesets and create them.
      this.loadJSONBatch(this.TILESETS_DIRECTORY, data.tilesets, function (tilesetData) {
        var tileset = this.createTileset(tilesetData);
      }, function () {
        
        // Load JSON data on all Maps and create them.
        this.loadJSONBatch(this.MAPS_DIRECTORY, data.maps, function (mapData) {
          var map = this.createMap(mapData);
        }, function () {
          
          // Create all Entities.
          for (i = 0, len = data.entities.length; i < len; i++) {
            this.createEntity(data.entities[i]);
          }
          
          // Create all Players and associate their Entities with them.
          for (i = 0, len = data.players.length; i < len; i++) {
            player = this.createPlayer(data.players[i]);
            player.entity = this.getEntity(player.entityId);
            if (player.uuid === data.uuid) {
              this.player = player;
            }
          }
          
          // Make a chatbox.
          this.chatbox = Object.create(Chatbox).init({
            sendMessage: this.sendChatMessageToServer.bind(this),
            $el: this.$el.find('.chatbox')
          });
          
          // Give the client control.
          this.initInput();
          
          // Optionally execute an arbitrarily-defined setup function.
          if (this.setup) this.setup();
          
          // Now it's REALLY HAPPENING!
          this.refreshConstantly = this.refreshConstantly.bind(this);
          this.refreshConstantly();
          
          // Let the server know that client has successfully joined the game.
          this.socket.emit('clientJoinSuccess');
          
          // Start receiving events from the server.
          this.setSocketEvents({
            'createPlayer': this.onCreatePlayer,
            'startMovingContinuously': this.onStartMovingContinuously,
            'stopMovingContinuously': this.onStopMovingContinuously,
            'entitiesSnapshot': this.onEntitiesSnapshot,
            'sendChatMessageToClient': this.onSendChatMessageToClient
          });
          
        }, this);
      }, this);
      
      return this;
    },
    
    // Callback to create and link a Player and his Entity.
    onCreatePlayer: function (data) {
      var entity = this.createEntity(data.entity);
      data.player.entity = entity;
      this.createPlayer(data.player);
    },
    
    // Callback to receive snapshots of Entities and update them accordingly.
    // TODO: This is a testing implementation, give it a better one soon.
    // Actually improvements may only need to be made server-side, but
    // we'll see.
    onEntitiesSnapshot: function (data) {
      var i, len;
      for (i = 0, len = data.length; i < len; i++) {
        var snapshot = data[i];
        var entity = this.getEntity(snapshot.id);
        entity.x = snapshot.x;
        entity.y = snapshot.y;
        entity.direction = snapshot.direction;
      }
      this.entitiesChanged = true;
    },
    
    // When told to move, do so.
    onStartMovingContinuously: function (data) {
      var entity = this.getEntity(data.id);
      this.startMovingContinuously(entity, data.direction, entity.currentMap);
    },
    
    // When told to stop, stop.
    onStopMovingContinuously: function (data) {
      var entity = this.getEntity(data.id);
      this.stopMovingContinuously(entity);
    },
    
    sendChatMessageToServer: function (message) {
      this.socket.emit('sendChatMessageToServer', {
        message: message
      });
    },
    
    // Callback for receiving [public] chat messages.
    onSendChatMessageToClient: function (data) {
      var player;
      if (data.identifier === this.serverInfo.name) {
        data.name = this.serverInfo.name;
        data.color = this.serverInfo.color;
      } else {
        player = this.getPlayer(data.identifier);
        data.name = player.name;
        data.color = player.color;
      }
      this.chatbox.addMessage(data);
    },
    
    // Loads multiple JSON files using jQuery and executes a callback after
    // they are all loaded.
    // CONSIDER: Use a promise?
    loadJSONBatch: function (directory, files, iterator, complete, thisArg) {
      var filesLoaded, filesLength, i;
      filesLoaded = 0;
      filesLength = files.length;
      for (i = 0; i < filesLength; i++) {
        $.getJSON(directory + files[i] + '.json', function (data) {
          iterator.call(thisArg, data);
          if (++filesLoaded === filesLength) complete.call(thisArg);
        });
      }
    },
    
    // Convenience method for setting events.
    setSocketEvents: function (events) {
      _.each(events, function (callback, event) {
        this.socket.on(event, callback.bind(this));
      }, this);
    },
    
    // Handles the case when a direction key is let go but there is still an
    // alternate direction key being pressed. The "best" alternate key's
    // direction is returned. The Player can then resume moving in that
    // direction.
    switchBack: function (input, unpressedKey) {
      
      var keyProperties, oppositeKey, adjacentKey, adjacentOppositeKey, direction, otherKeyIsPressed;
      
      keyProperties = input.keyProperties;
      oppositeKey = keyProperties[unpressedKey].opposite;
      adjacentKey = keyProperties[unpressedKey].adjacent;
      adjacentOppositeKey = keyProperties[adjacentKey].opposite;
      
      if (input.keyIsPressed(oppositeKey)) {
        direction = keyProperties[oppositeKey].direction;
        otherKeyIsPressed = true;
      } else if (input.keyIsPressed(adjacentKey)) {
        direction = keyProperties[adjacentKey].direction;
        otherKeyIsPressed = true;
      } else if (input.keyIsPressed(adjacentOppositeKey)) {
        direction = keyProperties[adjacentOppositeKey].direction;
        otherKeyIsPressed = true;
      }
      
      if (otherKeyIsPressed) {
        return direction;
      }
      return false;
    },
    
    // Initializes the user input callbacks. (So large that it merited its
    // own method.)
    initInput: function () {
      
      // Handle initial keydowns generically for the movement keys.
      var movementKeydown = (function (event) {
        this.startMovingContinuously(this.player.entity, this.input.keyProperties[event.which].direction, this.player.entity.currentMap);
      }).bind(this);
      
      // Handle keyups, be them switchbacks or all-keys-unpressed,
      // generically for the movement keys.
      var movementKeyup = (function (event) {
        var direction = this.switchBack(this.input, event.which);
        if (direction) {
          this.startMovingContinuously(this.player.entity, direction, this.player.entity.currentMap);
        } else {
          this.stopMovingContinuously(this.player.entity);
        }
      }).bind(this);
      
      // Setup input callbacks for keycodes and associate information with
      // certain keys.
      this.input = Object.create(Input).init({
        65: {
          keydown: movementKeydown, keyup: movementKeyup,
          properties: { direction: 'left', opposite: 68, adjacent: 87 }
        },
        87: {
          keydown: movementKeydown, keyup: movementKeyup,
          properties: { direction: 'up', opposite: 83, adjacent: 65 }
        },
        68: {
          keydown: movementKeydown, keyup: movementKeyup,
          properties: { direction: 'right', opposite: 65, adjacent: 87 }
        },
        83: {
          keydown: movementKeydown, keyup: movementKeyup,
          properties: { direction: 'down', opposite: 87, adjacent: 65 }
        }
      });
    },
    
    // Entities are drawn from background to foreground. It's necessary to
    // sort them by whomever is closest to the northern side of the map.
    // This needs to be done (on a refresh) if any Entities' positions
    // have changed.
    sortEntitiesByY: (function () {
      var compareFunction = function (a, b) {
        return a.y - b.y;
      };
      return function () {
        this.entities.sort(compareFunction);
      };
    }()),
    
    // Redraws the canvas.
    refresh: function () {
      if (this.entitiesChanged) {
        // CONSIDER: Is it safe to be constantly sorting the entities?
        this.sortEntitiesByY();
        this.entitiesChanged = false;
      }
      // TODO: Once multiple canvases are implemented, only the Entity layer
      // (and also changed map layers) will need to be redrawn.
      this.sketch.drawLayeredMap('main', this.player.entity.currentMap, this.entities);
    },
    
    // Redraws the canvas at approximately 60 frames-per-second.
    // (requestAnimationFrame is polyfilled for browsers that don't have it.)
    refreshConstantly: function () {
      this.refresh();
      requestAnimationFrame(this.refreshConstantly);
    }
    
  });
  
  return ClientGame;
});

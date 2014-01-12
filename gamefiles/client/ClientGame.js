define(['jquery', 'socket.io', 'underscore',
        'shared/Game', 'shared/inherits',
        'client/Chatbox', 'client/Input', 'client/Sketch',
        'client/polyfills'],
function ($, io, _,
          Game, inherits,
          Chatbox, Input, Sketch) {
  
  var ClientGame = inherits(Game, {
    
    init: function (applySuper, args) {
      args = args || {};
      
      applySuper(this);
      
      this.host = args.host || 'http://localhost';
      this.port = args.port || 3000;
      this.$el = args.$el || (args.el ? $(args.el) : $('#game-container'));
      this.player = null;
      this.currentMap = null;
      
      this.sketch = Object.create(Sketch).init(args.sketchArgs);
      // TODO: Multiple canvases, these settings are arbitrary.
      this.canvas = this.sketch.createCanvas('main', 640, 480);
      this.sketch.appendCanvas('main');
      
      // Maps might have animated tiles, this can be used for cosmetic
      // updates to the caches (redraw only changed tiles onto the cache).
      //this.tilesChanged = [
        //0, 5, 24
      //];
      
      this.chatbox = Object.create(Chatbox).init({
        sendMessage: this.sendChatMessageToServer.bind(this),
        $el: this.$el.find('.chatbox')
      });
      
      this.socket = io.connect(this.host + ':' + this.port);
      
      this.socket.on('clientJoin', this.onClientJoin.bind(this));
      this.socket.on('createPlayer', this.onCreatePlayer.bind(this));
      //this.socket.on('movePlayer', this.onMovePlayer.bind(this));
      this.socket.on('startMovingContinuously', this.onStartMovingContinuously.bind(this));
      this.socket.on('stopMovingContinuously', this.onStopMovingContinuously.bind(this));
      this.socket.on('sendChatMessageToClient', this.onSendChatMessageToClient.bind(this));
      
      this.initInput();
      
      if (args.setup) {
        args.setup.call(this);
      }
      
      this.refreshConstantly = this.refreshConstantly.bind(this);
      this.refreshConstantly();
      
      return this;
    },
    
    // Processes all information the server gives to the client after
    // joining the game.
    onClientJoin: function (data) {
      var i, len, entity;
      
      console.log('onClientJoin data', data);
      
      this.serverInfo = data.serverInfo;
      
      for (i = 0, len = data.entities.length; i < len; i++) {
        this.createEntity(data.entities[i]);
      }
      
      for (i = 0, len = data.players.length; i < len; i++) {
        var player = this.createPlayer(data.players[i]);
        player.entity = this.getEntity(player.entityId);
        if (player.uuid === data.uuid) {
          this.player = player;
        }
      }
    },
    
    // Accepts data on a Player's Entity and that Player himself and
    // creates and links both.
    onCreatePlayer: function (data) {
      var entity;
      entity = this.createEntity(data.entity);
      data.player.entity = entity;
      this.createPlayer(data.player);
    },
    
    /*onMovePlayer: function (data) {
      var mover = this.getPlayer(data.uuid).entity;
      this.move(mover, data.direction, this.currentMap);
    },*/
    
    startMovingContinuously: function (entity, direction, layeredMap) {
      var newDirection;
      newDirection = direction !== entity.direction;
      if (!entity.moving || newDirection) {
        entity.moving = true;
        if (newDirection) {
          clearTimeout(entity.movementTimeout);
        }
        this.moveContinuously(entity, direction, layeredMap);
        // Only tell the world that the Entity is moving if you are in
        // control of him.
        if (entity === this.player.entity) {
          this.socket.emit('startMovingContinuously', { direction: direction });
        }
      }
    },
    
    stopMovingContinuously: function (entity) {
      entity.moving = false;
      if (entity === this.player.entity) {
        this.socket.emit('stopMovingContinuously');
      }
    },
    
    onStartMovingContinuously: function (data) {
      var player = this.getPlayer(data.uuid);
      // Last arg SHOULD be a map id or something.
      this.startMovingContinuously(player.entity, data.direction, this.currentMap);
    },
    
    onStopMovingContinuously: function (data) {
      var player = this.getPlayer(data.uuid);
      this.stopMovingContinuously(player.entity);
    },
    
    moveContinuously: function (mover, direction, layeredMap) {
      if (mover.moving) {
        mover.nextFrame();
        this.move(mover, direction, layeredMap);
        mover.movementTimeout = setTimeout((function () {
          this.moveContinuously(mover, direction, layeredMap);
        }).bind(this), mover.moveRate);
      } else {
        mover.frame = 0;
        clearTimeout(mover.movementTimeout);
      }
    },
    
    switchBack: function (input, unpressedKey) {
      
      var keyProperties, oppositeKey, adjacentKey, adjacentOppositeKey, otherKeyIsPressed;
      
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
    
    sendChatMessageToServer: function (message) {
      this.socket.emit('sendChatMessageToServer', {
        message: message
      });
    },
    
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
    
    initInput: function () {
      
      // Handle initial keydowns generically for the movement keys.
      var movementKeydown = (function (event) {
        this.startMovingContinuously(this.player.entity, this.input.keyProperties[event.which].direction, this.currentMap);
      }).bind(this);
      
      // Handle keyups, be them switchbacks or all-keys-unpressed,
      // generically for the movement keys.
      var movementKeyup = (function (event) {
        var direction = this.switchBack(this.input, event.which);
        if (direction) {
          this.startMovingContinuously(this.player.entity, direction, this.currentMap);
        } else {
          this.stopMovingContinuously(this.player.entity);
        }
      }).bind(this);
      
      this.input = Object.create(Input).init({
        65: {
          keydown: movementKeydown,
          keyup: movementKeyup,
          properties: {
            direction: 'left',
            opposite: 68,
            adjacent: 87
          }
        },
        87: {
          keydown: movementKeydown,
          keyup: movementKeyup,
          properties: {
            direction: 'up',
            opposite: 83,
            adjacent: 65
          }
        },
        68: {
          keydown: movementKeydown,
          keyup: movementKeyup,
          properties: {
            direction: 'right',
            opposite: 65,
            adjacent: 87
          }
        },
        83: {
          keydown: movementKeydown,
          keyup: movementKeyup,
          properties: {
            direction: 'down',
            opposite: 87,
            adjacent: 65
          }
        },
      });
    },
    
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
      this.sketch.drawLayeredMap('main', this.currentMap, this.entities);
    },
    
    // Redraws the canvas at approximately 60 frames-per-second.
    refreshConstantly: function () {
      this.refresh();
      requestAnimationFrame(this.refreshConstantly);
    }
  });
  
  return ClientGame;
});

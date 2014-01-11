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
      
      this.chatbox = Object.create(Chatbox).init({
        sendMessage: this.sendChatMessageToServer.bind(this),
        $el: this.$el.find('.chatbox')
      });
      
      this.socket = io.connect(this.host + ':' + this.port);
      
      this.socket.on('clientJoin', this.onClientJoin.bind(this));
      this.socket.on('createPlayer', this.onCreatePlayer.bind(this));
      this.socket.on('movePlayer', this.onMovePlayer.bind(this));
      this.socket.on('sendChatMessageToClient', this.onSendChatMessageToClient.bind(this));
      
      this.initInput();
      
      if (args.setup) {
        // Pass `this` as the first argument to the setup function. That
        // way the setup function can refer to itself as `game`.
        args.setup.call(this, this);
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
    
    onMovePlayer: function (data) {
      var mover = this.getPlayer(data.uuid).entity;
      this.move(mover, data.direction, this.currentMap, true);
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
        console.log(this.players);
        console.log(data);
        player = this.getPlayer(data.identifier);
        data.name = player.name;
        data.color = player.color;
      }
      this.chatbox.addMessage(data);
    },
    
    // Initializes an Input handler object on `this`, with callbacks
    // bound to `this`.
    initInput: function () {
      this.input = Object.create(Input).init({
        65: {
          keydown: function (event) {
            this.startMovingContinuously(this.player.entity, 'left', this.currentMap, this.input, event.which);
          }.bind(this),
          properties: {
            direction: 'left',
            opposite: 68,
            adjacent: 87
          }
        },
        87: {
          keydown: function (event) {
            this.startMovingContinuously(this.player.entity, 'up', this.currentMap, this.input, event.which);
          }.bind(this),
          properties: {
            direction: 'up',
            opposite: 83,
            adjacent: 65
          }
        },
        68: {
          keydown: function (event) {
            this.startMovingContinuously(this.player.entity, 'right', this.currentMap, this.input, event.which);
          }.bind(this),
          properties: {
            direction: 'right',
            opposite: 65,
            adjacent: 87
          }
        },
        83: {
          keydown: function (event) {
            this.startMovingContinuously(this.player.entity, 'down', this.currentMap, this.input, event.which);
          }.bind(this),
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

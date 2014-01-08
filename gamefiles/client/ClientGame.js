define(['socket.io',
        'shared/Game', 'shared/inherits',
        'client/Chatbox', 'client/Input', 'client/Sketch',
        'client/polyfills'],
function (io,
          Game, inherits,
          Chatbox, Input, Sketch) {
  
  var ClientGame = inherits(Game, {
    
    init: function (applySuper, args) {
      var setup, sketchArgs;
      
      args = args || {};
      setup = args.setup;
      sketchArgs = args.sketchArgs;
      
      applySuper(this);
      
      this.player = null;
      this.currentMap = null;
      
      this.sketch = Object.create(Sketch).init(sketchArgs);
      this.canvas = this.sketch.createCanvas('main', 640, 480);
      this.sketch.appendCanvasToContainer('main');
    
      this.socket = io.connect('http://localhost:3000');
      
      this.socket.on('playerJoined', (function (data) {
        this.player = this.createPlayer(data.player.character);
        
        (function () {
          var entity;
          for (var i = 0, len = data.entities.length; i < len; i++) {
            entity = data.entities[i].character;
            this.createPlayer(entity);
          }
        }.bind(this)());
        
        // The Chatbox will eventually have player info bound to it.
        this.initChatbox();
      }).bind(this));
      
      this.socket.on('createPlayer', (function (data) {
        this.createPlayer(data.player.character);
      }).bind(this));
      
      this.initInput();
      
      if (setup) {
        // Pass `this` as the first argument to the setup function. That
        // way the setup function can refer to itself as `game`, which feels
        // more semantic.
        setup.call(this, this);
      }
      
      this.refreshConstantly = this.refreshConstantly.bind(this);
      this.refreshConstantly();
      
      return this;
    },
    
    // Initializes a Chatbox object on `this`, the Chatbox having its own
    // client-side Chat object.
    // TODO: Bind player info to the Chat object.
    // TODO: Seriously rethink the way these models are linked.
    initChatbox: function () {
      this.chatbox = Object.create(Chatbox).init({
        socket: this.socket,
        el: '#Chatbox'
      });
      //this.chat = this.chatbox.chat;
    },
    
    // Initializes an Input handler object on `this`, with callbacks
    // bound to `this`.
    initInput: function () {
      this.input = Object.create(Input).init({
        65: {
          keydown: function (event) {
            this.startMovingContinuously(this.player, 'left', this.currentMap, this.input, event.which);
          }.bind(this),
          properties: {
            direction: 'left',
            opposite: 68,
            adjacent: 87
          }
        },
        87: {
          keydown: function (event) {
            this.startMovingContinuously(this.player, 'up', this.currentMap, this.input, event.which);
          }.bind(this),
          properties: {
            direction: 'up',
            opposite: 83,
            adjacent: 65
          }
        },
        68: {
          keydown: function (event) {
            this.startMovingContinuously(this.player, 'right', this.currentMap, this.input, event.which);
          }.bind(this),
          properties: {
            direction: 'right',
            opposite: 65,
            adjacent: 87
          }
        },
        83: {
          keydown: function (event) {
            this.startMovingContinuously(this.player, 'down', this.currentMap, this.input, event.which);
          }.bind(this),
          properties: {
            direction: 'down',
            opposite: 87,
            adjacent: 65
          }
        },
      });
    },
    
    // Redraws the canvas.
    refresh: (function () {
      var callback = function (a, b) {
        return a.y - b.y;
      };
      return function () {
        if (this.entitiesChanged) {
          // CONSIDER: Is it safe to be constantly sorting the entities?
          // Will that cause interference anywhere else?
          this.entities = this.entities.sort(callback);
          this.entitiesChanged = false;
        }
        this.sketch.drawLayeredMap('main', this.currentMap, this.entities);
      }
    }()),
    
    // Redraws the canvas at approximately 60 frames-per-second.
    refreshConstantly: function () {
      this.refresh();
      requestAnimationFrame(this.refreshConstantly);
    }
  });
  
  return ClientGame;
});

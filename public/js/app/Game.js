define(['app/Sketch', 'app/Input', 'app/ImageLoader', 'app/polyfills'],
function (Sketch, Input, ImageLoader) {
  
  'use strict';
  
  var Game = {
    
    init: function (args) {
      
      if (args.sketchArgs) {
        this.sketch = Object.create(Sketch).init(args.sketchArgs);
      } else {
        this.sketch = Object.create(Sketch).init();
      }
      
      this.canvas = this.sketch.createCanvas('main', 640, 480);
      this.sketch.appendCanvasToContainer('main');
      
      this.currentMap = null;
      
      this.entities = [];
      this.entitiesChanged = false;
      this.refreshConstantly = this.refreshConstantly.bind(this);
      
      this.initInput();
      
      args.setup.call(this);
      
      this.refreshConstantly();
    },
    
    initInput: function () {
      this.input = Object.create(Input).init({
        65: {
          keydown: function (event) {
            this.game.player.startMovingContinuously('left', this.game.currentMap, this.game.entities, this, event.which);
          },
          properties: {
            direction: 'left',
            opposite: 68,
            adjacent: 87
          }
        },
        87: {
          keydown: function (event) {
            this.game.player.startMovingContinuously('up', this.game.currentMap, this.game.entities, this, event.which);
          },
          properties: {
            direction: 'up',
            opposite: 83,
            adjacent: 65
          }
        },
        68: {
          keydown: function (event) {
            this.game.player.startMovingContinuously('right', this.game.currentMap, this.game.entities, this, event.which);
          },
          properties: {
            direction: 'right',
            opposite: 65,
            adjacent: 87
          }
        },
        83: {
          keydown: function (event) {
            this.game.player.startMovingContinuously('down', this.game.currentMap, this.game.entities, this, event.which);
          },
          properties: {
            direction: 'down',
            opposite: 87,
            adjacent: 65
          }
        },
      });
      this.input.game = this;
    },
    
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
    
    refreshConstantly: function () {
      this.refresh();
      requestAnimationFrame(this.refreshConstantly);
    },
    
    addEntity: function (entity) {
      entity.game = this;
      this.entities.push(entity);
      this.entitiesChanged = true;
      return entity;
    },
    
    removeEntity: function (entity) {
      var index = this.entities.indexOf(entity);
      if (index > -1) {
        entity.game = null;
        this.entities.splice(index, 1);
        this.entitiesChanged = true;
        return true;
      }
      return false;
    },
  };
  
  return Game;
});  

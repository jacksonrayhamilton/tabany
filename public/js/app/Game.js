define(['app/Sketch', 'app/Input', 'app/ImageLoader', 'app/polyfills'],
function (Sketch, Input, ImageLoader) {
  
  'use strict';
  
  var Game = {
    
    init: function (args) {
      
      this.sketch = Object.create(Sketch).init();
      this.canvas = this.sketch.createCanvas('main', 640, 480);
      this.sketch.appendCanvasToContainer('main');
      
      this.entities = [];
      this.entitiesChanged = false;
      this.refreshConstantly = this.refreshConstantly.bind(this);
      
      this.initInput();
      
      this.sketch.loadImages(args.images, (function () {
        args.setup();
        this.refreshConstantly();
      }).bind(this));
    },
    
    initInput: function () {
      this.input = Object.create(Input);
      this.input.init({
        65: function (event) {
          player.startMovingContinuously('left', currentMap, entities, this, event.which);
        },
        87: function (event) {
          player.startMovingContinuously('up', currentMap, entities, this, event.which);
        },
        68: function (event) {
          player.startMovingContinuously('right', currentMap, entities, this, event.which);
        },
        83: function (event) {
          player.startMovingContinuously('down', currentMap, entities, this, event.which);
        },
      }, {
        65: {
          direction: 'left',
          opposite: 68,
          adjacent: 87
        },
        87: {
          direction: 'up',
          opposite: 83,
          adjacent: 65
        },
        68: {
          direction: 'right',
          opposite: 65,
          adjacent: 87
        },
        83: {
          direction: 'down',
          opposite: 87,
          adjacent: 65
        }
      });
    },
    
    refresh: (function () {
      var callback = function (a, b) {
        return a.y - b.y;
      };
      return function () {
        if (this.entitiesChanged) {
          console.log('Entities were changed!');
          // NOTE FOR THE FUTURE:
          // Is it safe to be constantly sorting the entities?
          // Will that cause interference anywhere else?
          this.entities = this.entities.sort(callback);
          this.entitiesChanged = false;
        }
        console.log(this);
        this.canvas.drawLayeredMap(this.currentMap, this.entities);
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
    },
    
    removeEntity: function (entity) {
      var index = this.entities.indexOf(entity);
      if (index > -1) {
        delete entity.game;
        this.entities.splice(index, 1);
        this.entitiesChanged = true;
      }
    },
  };
  
  return Game;
});  

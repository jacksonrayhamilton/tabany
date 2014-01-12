requirejs.config({
  // All scripts are loaded from gamefiles/ by default.
  baseUrl: 'gamefiles',
  paths: {
    // Uncomment minified scripts for production.
    jquery: [
      //'//code.jquery.com/jquery-1.10.2.min',
      //'client/lib/jquery-1.10.2.min',
      'client/lib/jquery-1.10.2'
    ],
    underscore: [
      //'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
      //'client/lib/underscore-min',
      'client/lib/underscore'
    ],
    moment: [
      //'//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.0/moment.min',
      //'client/lib/moment.min',
      'client/lib/moment'
    ],
    'socket.io': '/socket.io/socket.io',
    domReady: 'client/lib/domReady',
    text: 'shared/lib/text'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    'socket.io': {
      exports: 'io'
    }
  }
});

// Start the main client logic.
requirejs(['shared/Tilemap', 'shared/Tileset', 'shared/LayeredMap',
           'text!shared/entity_images.json', 'text!shared/tileset_images.json', 
           'client/ClientGame'],
function (Tilemap, Tileset, LayeredMap,
          entityImages, tilesetImages,
          ClientGame) {
  
  'use strict';
  
  entityImages = JSON.parse(entityImages);
  tilesetImages = JSON.parse(tilesetImages);
  
  Object.create(ClientGame).init({
    sketchArgs: {
      "entityImages": entityImages,
      "tilesetImages": tilesetImages
    },
    setup: function () {
      
      var icyTileset = Object.create(Tileset).init({
        tiles: [
          {},{},{},{},{"impassible": true},{"impassible": true},{},{},
          {"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{},
          {"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},
          {"impassible": ["up"]},{"impassible": ["up"]},{"impassible": true},{"impassible": true},{},{},{"impassible": true},{},
          {},{},{},{},{"raised": true},{"raised": true},{"raised": true},{},
          {},{},{},{"raised": true},{"raised": true},{"raised": true},{"raised": true},{},
          {},{},{},{"impassible": true},{"raised": true},{"impassible": true},{"raised": true},{},
          {},{},{},{},{"impassible": true},{},{},{},
          {"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": ["left"]},{"impassible": ["right"]},
          {"impassible": true},{},{"impassible": true},{"impassible": true},{},{"impassible": true},{"impassible": ["left"]},{"impassible": ["right"]},
          {"impassible": true},{"impassible": true},{"impassible": true},{},{},{},{},{"impassible": ["down"], "raised": true},
          {"impassible": true},{"impassible": true},{"impassible": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{},{},
          {"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{},{"impassible": true},{},{"impassible": true},
          {"impassible": ["left", "up"], "raised": true},{"impassible": ["up"], "raised": true},{"impassible": ["up", "right"], "raised": true},{"impassible": true},{"impassible": true},{"impassible": true},{},{},
          {"impassible": ["left"]},{},{"impassible": ["right"]},{"impassible": true},{},{"impassible": true},{},{"impassible": true},
          {"impassible": ["left"]},{},{"impassible": ["right"]},{"impassible": true},{},{"impassible": true},{},{"impassible": true},
          {"impassible": ["left"]},{},{"impassible": ["right"]},{},{},{},{},{},
          {},{},{},{},{},{},{},{},
          {"raised": true},{"raised": true},{"raised": true},{},{},{},{},{},
          {"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},
          {"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": ["left"]},{},{"impassible": ["right"]},
          {"raised": true},{"raised": true},{"raised": true},{},{},{"impassible": ["left"]},{},{"impassible": ["right"]},
          {"impassible": true},{"impassible": true},{"impassible": true},{"impassible": ["left", "right"]},{},{"impassible": ["left", "down"], "raised": true},{},{"impassible": ["right", "down"], "raised": true},
          {"impassible": true},{},{"impassible": true},{},{},{},{},{},
        ],
        image: 'icy',
        width: 8,
        tileSize: 32
      });
      
      var icyMap = Object.create(LayeredMap).init({
        tileset: icyTileset, // should be a string
        width: 20,
        height: 15,
        layers: [
          [
            Object.create(Tilemap).init({
              tiles: [
                  1,  1,  1,  1,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,
                  1,  1,  1,  1,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,
                  1,  1,  1,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,
                  1,  1,  1,  1,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,
                  1,  1,  1,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,
                  1,  1,  1,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  1,
                  1,  1,  1,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  1,
                  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  1,
                  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  1,
                  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  1,
                  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,112,113,114,  6,
                  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,120,121,122,  6,
                  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,128,129,130,  6,
                  1,  1,  1, 89,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,
                  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6
              ],
              width: 20,
              height: 15,
              x: 0, y: 0
            })
          ],
          [
            Object.create(Tilemap).init({
              tiles: [
                   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   ,   ,   ,   ,   ,   ,   ,  2,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   , 10,  3,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   ,   ,   ,   ,  3,   ,  2,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   , 11,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,  2,   ,   ,
                   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,104,105,106,   ,
                   ,   ,   ,   ,   ,   ,   ,   ,   ,  4,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   , 99,100,101,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   ,107,108,109,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
                   ,   , 88,   , 90,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,136,137,138,   ,
                   ,   , 96, 97, 98,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,
              ],
              width: 20, height: 15,
              x: 0, y: 0
            }),
          ],
          [
            Object.create(Tilemap).init({
              tiles: [
                 36, 37, 38,
                 44, 45, 46,
                 52, 53, 54,
              ],
              width: 3, height: 3,
              x: 2, y: 2
            }),
            Object.create(Tilemap).init({
              tiles: [
                 36, 37, 38,
                 44, 45, 46,
                 52, 53, 54,
              ],
              width: 3, height: 3,
              x: 5, y: 3
            }),
            Object.create(Tilemap).init({
              tiles: [
                 13, 14,
                 21, 22,
              ],
              width: 2, height: 2,
              x: 5, y: 7
            }),
            Object.create(Tilemap).init({
              tiles: [
                 91, 92, 93
              ],
              width: 3, height: 1,
              x: 2, y: 10
            })
          ]
        ]
      });
      
      this.currentMap = icyMap;
      
      var $container = this.sketch.$el;
      var containerOffset = $container.offset();
      $container.on('click', (function (event) {
        this.player.entity.x = event.pageX - Math.floor(containerOffset.left);
        this.player.entity.y = event.pageY - Math.floor(containerOffset.top);
        this.entitiesChanged = true;
      }).bind(this));
    }
  });
  
});

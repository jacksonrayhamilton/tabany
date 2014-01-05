define(['domReady!', 'jquery', 'underscore',
        'app/Game', 'app/ImageLoader', 'app/Sketch', 'app/Tileset',
        'app/Tilemap', 'app/LayeredMap', 'app/Input',
        'app/Entity', 'app/polyfills'],
function (doc, $, _,
          Game, ImageLoader, Sketch, Tileset,
          Tilemap, LayeredMap, Input,
          Entity) {

'use strict';

// TODO: Move these tiles and maps into other files!
// Load them in somehow.

var icyTiles = [
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
];

var myTilemapTiles0 = [
  1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1,
  1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 112, 113, 114, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 120, 121, 122, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 128, 129, 130, 6,
  1, 1, 1,89, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
];

var myTilemapTiles1 = [
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  , 2,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,10, 3,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  , 3,  , 2,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,11,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 2,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  104, 105, 106,  ,
   ,  ,64,65,66,  ,  ,  ,  , 4,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,72,  ,74,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,80,81,82,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,88,  ,90,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  136, 137, 138,  ,
   ,  ,96,97,98,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
];

var wellTiles = [
  13, 14,
  21, 22,
];

var treeTiles = [
  36, 37, 38,
  44, 45, 46,
  52, 53, 54,
];

var platformTiles = [
  104, 105, 106,
  112, 113, 114,
  120, 121, 122,
];

Object.create(Game).init({
  sketchArgs: {
    entityImages: {
      'ifrit': '/images/sprites/ifrit.png',
      'gir': '/images/sprites/Gir-f_girsample2m_e3814ec.png'
    },
    tilesetImages: {
      'icy': '/images/tilesets/Gratheo-breezeicyyj9.png'
    }
  },
  setup: function (game) {
    
    var icyTileset = Object.create(Tileset).init(icyTiles, 'icy', 8, 24);
    var icyMap = Object.create(LayeredMap).init([
      [
        Object.create(Tilemap).init(myTilemapTiles0, 20, 15, 0, 0, 0)
      ],
      [
        Object.create(Tilemap).init(myTilemapTiles1, 20, 15, 0, 0, 0),
        Object.create(Tilemap).init(treeTiles, 3, 3, 2, 2),
        Object.create(Tilemap).init(treeTiles, 3, 3, 5, 3),
        Object.create(Tilemap).init(wellTiles, 2, 2, 5, 7),
      ],
    ], icyTileset, 20, 15);
    
    game.currentMap = icyMap;
    
    var player = Object.create(Entity).init(0, 160, 16, 16, 'ifrit', 'down', 5, 10);
    game.addEntity(player);
    game.player = player;
    
    // Generate some dummy Entities
    /*(function () {
      for (var i = 0; i < 10; i++) {
        var y = Math.floor(i / game.currentMap.width);
        var x = i % game.currentMap.width;
        game.addEntity(Object.create(Entity).init(32 + (x * 48), 32 + (y * 48), 16, 16, 'gir', 'down', 5, 10));
      }
    }());*/
    
    //game.addEntity(Object.create(Entity).init(7 * 32, 8 * 32, 16, 16, 'gir', 'left', 5, 10));
    
    // very hackish teleporting
    var $container = $(game.sketch.container);
    var containerOffset = $container.offset();
    $container.on('click', function (e) {
      game.player.x = e.pageX - containerOffset.left;
      game.player.y = e.pageY - containerOffset.top;
      game.entitiesChanged = true;
    });
    
  }
});

  

});

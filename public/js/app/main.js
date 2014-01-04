define(['jquery', 'underscore',
        'app/Game', 'app/ImageLoader', 'app/Sketch', 'app/Tileset',
        'app/Tilemap', 'app/LayeredMap', 'app/Input',
        'app/Entity', 'app/polyfills'],
function ($, _,
          Game, ImageLoader, Sketch, Tileset,
          Tilemap, LayeredMap, Input,
          Entity) {
$(function () {

'use strict';

// [0, 1, 2, 3]
// left up right down
var icyTiles = [
  {},{},{},{},{"impassible": true},{"impassible": true},{},{},
  {"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{},
  {"impassible": ["down"], "raised": true},{"impassible": ["down"], "raised": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},
  {"impassible": ["up"]},{"impassible": ["up"]},{"impassible": true},{"impassible": true},{},{},{"impassible": true},{},
  {},{},{},{},{"raised": true},{"raised": true},{"raised": true},{},
  {},{},{},{"raised": true},{"raised": true},{"raised": true},{},{},
  {},{},{},{"impassible": true},{"raised": true},{"impassible": true},{"raised": true},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {"impassible": ["left", "up"], "raised": true},{"impassible": ["up"], "raised": true},{"impassible": ["up", "right"], "raised": true},{},{},{},{},{},
  {"impassible": ["left"]},{},{"impassible": ["right"]},{},{},{},{},{},
  {"impassible": ["left"]},{},{"impassible": ["right"]},{},{},{},{},{},
  {"impassible": ["left"]},{},{"impassible": ["right"]},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
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
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
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
   ,  ,  ,  ,  ,  ,  ,  ,  , 4,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  136, 137, 138,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
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
  images: {
    'tilesets/icy': '/images/tilesets/Gratheo-breezeicyyj9.png',
    'sprites/gir': '/images/sprites/Gir-f_girsample2m_e3814ec.png',
    'sprites/ifrit': '/images/sprites/ifrit.png'
  },
  setup: function (images) {
    
    var game = this;
    
    var main = game.sketch.canvases.main;
    
    var icyTileset = Object.create(Tileset).init(icyTiles, images['tilesets/icy']);
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
    var currentMap = game.currentMap;
    
    var player = game.addEntity(Object.create(Entity).init(0, 160, 16, 16, images['sprites/ifrit'], 'down', 5, 10));
    game.player = player;
    
    (function () {
      for (var i = 0; i < 10; i++) {
        var y = Math.floor(i / currentMap.width);
        var x = i % currentMap.width;
        game.addEntity(Object.create(Entity).init(32 + (x * 48), 32 + (y * 48), 16, 16, images['sprites/gir'], 'down', 5, 10));
      }
    }());
    
    // very hackish teleporting
    var $container = $(game.sketch.container);
    var containerOffset = $container.offset();
    $container.on('click', function (e) {
      game.player.x = e.pageX - containerOffset.left;
      game.player.y = e.pageY - containerOffset.top;
    });
    
  }
});

  

});
});

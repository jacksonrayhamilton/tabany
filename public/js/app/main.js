define(['jquery', 'underscore',
        'app/ImageLoader', 'app/Sketch', 'app/Tileset',
        'app/Tilemap', 'app/LayeredMap', 'app/Input',
        'app/Entity', 'app/polyfills'],
function ($, _,
          ImageLoader, Sketch, Tileset,
          Tilemap, LayeredMap, Input,
          Entity) {
$(function () {

'use strict';

// [0, 1, 2, 3]
// left up right down
var icyTiles = [
  {},{},{},{},{"impassible": true},{"impassible": true},{},{},
  {"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": ["down"], "raised": 1},{"impassible": ["down"], "raised": 1},{},
  {"impassible": ["down"], "raised": 1},{"impassible": ["down"], "raised": 1},{"impassible": true},{"impassible": true},{"impassible": true},{"impassible": ["up"]},{"impassible": ["up"]},{"impassible": true},
  {"impassible": ["up"]},{"impassible": ["up"]},{"impassible": true},{"impassible": true},{},{},{"impassible": true},{},
  {},{},{},{},{"raised": 1},{"raised": 1},{"raised": 1},{},
  {},{},{},{"raised": 1},{"raised": 1},{"raised": 1},{},{},
  {},{},{},{"impassible": true},{"raised": 1},{"impassible": true},{"raised": 1},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {},{},{},{},{},{},{},{},
  {"impassible": ["left", "up"]},{"impassible": ["up"]},{"impassible": ["up", "right"]},{},{},{},{},{},
  {"impassible": ["left"]},{},{"impassible": ["right"]},{},{},{},{},{},
  {"impassible": ["left", "down"]},{"impassible": ["down"]},{"impassible": ["right", "down"]},{},{},{},{},{},
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
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
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
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  , 4,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
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

var sketch = Object.create(Sketch);
sketch.init();
sketch.createCanvas('main', 640, 480);
sketch.createCanvas('rendering', 640, 480);
sketch.appendCanvas('main');

ImageLoader.loadImages({
  
  'tilesets/icy': '/images/tilesets/Gratheo-breezeicyyj9.png',
  'sprites/gir': '/images/sprites/Gir-f_girsample2m_e3814ec.png',
  'sprites/ifrit': '/images/sprites/ifrit.png'
  
}, function (images) {
  
  var main = sketch.canvases.main;
  var rendering = sketch.canvases.rendering;
  var icy = Object.create(Tileset).init(icyTiles, images['tilesets/icy']);
  
  var icyMap = Object.create(LayeredMap).init([
    [
      Object.create(Tilemap).init(myTilemapTiles0, 20, 15, 0, 0, 0)
    ],
    [
      Object.create(Tilemap).init(myTilemapTiles1, 20, 15, 0, 0, 0),
      Object.create(Tilemap).init(treeTiles, 3, 3, 2, 2),
      Object.create(Tilemap).init(treeTiles, 3, 3, 5, 3),
      Object.create(Tilemap).init(wellTiles, 2, 2, 5, 7),
      Object.create(Tilemap).init(platformTiles, 3, 3, 10, 9),
    ],
  ], icy, 20, 15);
  
  console.log(icyMap);
  
  var player = Object.create(Entity).init(0, 160, 16, 16, images['sprites/ifrit']);
  
  var entities = [player];
  
  var refresh = function () {
    main.drawLayeredMap(icyMap, entities);
  };
  
  var refreshConstantly = function () {
    refresh();
    requestAnimationFrame(function () {
      refreshConstantly();
    });
  };
  
  //refreshConstantly();
  refresh(); // initial refresh
  
  // hackish testing
  var input = Object.create(Input).init({
    65: function () { player.move('left', icyMap); refresh(); },
    87: function () { player.move('up', icyMap); refresh(); },
    68: function () { player.move('right', icyMap); refresh(); },
    83: function () { player.move('down', icyMap); refresh(); },
  });
  
  // very hackish teleporting
  var $container = $(sketch.container);
  var containerOffset = $container.offset();
  $container.on('click', function (e) {
    player.x = e.pageX - containerOffset.left;
    player.y = e.pageY - containerOffset.top;
    refresh();
  });
  
});

  

});
});

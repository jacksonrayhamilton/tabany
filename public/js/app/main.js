define(['jquery', 'underscore', 'app/ImageLoader', 'app/Sketch',
        'app/Tileset', 'app/Tilemap', 'app/LayeredMap'],
function ($, _, ImageLoader, Sketch,
          Tileset, Tilemap, LayeredMap) {
$(function () {

'use strict';

// [0, 1, 2, 3]
// left up right down
var icyTiles = [
  {},{},{},{},{"impassible": 1},{"impassible": 1},{},{},
  {"impassible": 1},{"impassible": 1},{"impassible": 1},{"impassible": 1},{"impassible": 1},{"impassible": [3], "raised": 1},{"impassible": [3], "raised": 1},{},
  {"impassible": [3], "raised": 1},{"impassible": [3], "raised": 1},{"impassible": 1},{"impassible": 1},{"impassible": 1},{"impassible": [1]},{"impassible": [1]},{"impassible": 1},
  {"impassible": [1]},{"impassible": [1]},{"impassible": 1},{"impassible": 1},{},{},{"impassible": 1},{},
  //{},{},{},{},{},{},{},{},
];
var myTilemapTiles0 = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1,
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
   ,  , 3,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  , 3,  , 2,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
   ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 2,  ,  ,
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

var sketch = Object.create(Sketch);
sketch.init();
sketch.createCanvas('main', 640, 480);
sketch.createCanvas('rendering', 640, 480);
sketch.appendCanvas('main');

ImageLoader.loadImages({
  
  icy: '/a/tilesets/Gratheo-breezeicyyj9.png'
  
}, function (images) {
  
  var main = sketch.canvases.main;
  var rendering = sketch.canvases.rendering;
  var icy = Object.create(Tileset).init(icyTiles, images.icy);
  
  var icyMap = Object.create(LayeredMap).init([
    [
      Object.create(Tilemap).init(myTilemapTiles0, 20, 15, 0, 0, 0)
    ],
    [
      Object.create(Tilemap).init(myTilemapTiles1, 20, 15, 0, 0, 0),
      Object.create(Tilemap).init(wellTiles, 2, 2, 5, 1),
      Object.create(Tilemap).init(wellTiles, 2, 2, 9, 7),
    ],
  ], icy, 20, 15);
  
  console.log(icyMap);
  
  main.drawLayeredMap(icyMap);
  
  
});

  

});
});

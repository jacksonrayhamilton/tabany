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

var sketch = Object.create(Sketch);
sketch.init();
sketch.createCanvas('main', 640, 480);
sketch.createCanvas('rendering', 640, 480);
sketch.appendCanvas('main');

ImageLoader.loadImages(null, {
  
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
    ],
  ], icy, 20, 15);
  
  var currentMap = icyMap;
  
  var player = Object.create(Entity).init(0, 160, 16, 16, images['sprites/ifrit'], 'down', 5, 10);
  
  var entities = [
    player
  ];
  
  (function () {
    for (var i = 0; i < 10; i++) {
      var y = Math.floor(i / currentMap.width);
      var x = i % currentMap.width;
      entities.push(Object.create(Entity).init(32 + (x * 48), 32 + (y * 48), 16, 16, images['sprites/gir'], 'down', 5, 10));
    }
  }());
  
  var refresh = function () {
    main.drawLayeredMap(currentMap, entities);
  };
  
  var refreshConstantly = function () {
    refresh();
    requestAnimationFrame(function () {
      refreshConstantly();
    });
  };
  
  // Choose refresh rate
  switch (0) {
    // Silky-smooth but is a performance hog (until rendering
    // optimizations are made)
    case 0: refreshConstantly(); break;
    // Refresh once on load (other methods will call refresh()
    // on a need-by-need basis
    case 1: refresh(); break;
    // Choppy but isn't as brutal as case 0
    case 2:
      setInterval(function () {
        refresh();
      }, 200);
      break;
  }
  
  // kind of hackish testing
  var input = Object.create(Input);
  input.init({
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

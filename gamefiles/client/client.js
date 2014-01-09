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
// TODO: Honestly, seriously, MOVE THIS LOGIC INTO CLIENTGAME!
requirejs(['shared/Tilemap', 'shared/Tileset', 'shared/LayeredMap',
           'text!shared/entity_sprites.json', 'text!shared/tileset_sprites.json', 
           'client/ClientGame'],
function (Tilemap, Tileset, LayeredMap,
          entitySprites, tilesetSprites,
          ClientGame) {
  
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
     ,  ,  ,  ,  ,  ,  ,  ,  , 4,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
     ,  ,99,100,101,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
     ,  ,107,108,109,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
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

  var cliffEdge = {
    tiles: [91, 92, 93],
    width: 3, height: 1, x: 2, y: 10
  };
  
  entitySprites = JSON.parse(entitySprites);
  tilesetSprites = JSON.parse(tilesetSprites);
  
  Object.create(ClientGame).init({
    sketchArgs: {
      "entityImages": entitySprites,
      "tilesetImages": tilesetSprites
    },
    setup: function (game) {
      
      var cliffEdgeTilemap = Object.create(Tilemap);
      cliffEdgeTilemap.init.apply(cliffEdgeTilemap, _.values(cliffEdge));
      
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
          cliffEdgeTilemap
        ],
      ], icyTileset, 20, 15);
      
      game.currentMap = icyMap;
      
      var $container = game.sketch.$el;
      var containerOffset = $container.offset();
      $container.on('click', function (event) {
        game.player.x = event.pageX - Math.floor(containerOffset.left);
        game.player.y = event.pageY - Math.floor(containerOffset.top);
        game.entitiesChanged = true;
      });
    }
  });
  
});

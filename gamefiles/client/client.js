define(['domReady!', 'jquery', 'underscore',
        'client/ClientGame', 'client/ImageLoader', 'client/Sketch', 'shared/Tileset',
        'shared/Tilemap', 'shared/LayeredMap', 'client/Input',
        'shared/Entity'],
function (doc, $, _,
          ClientGame, ImageLoader, Sketch, Tileset,
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

Object.create(ClientGame).init({
  sketchArgs: {
    "entityImages": {
      "hero_a":       "GR-001heroA.png",
      "fighter_a":    "GR-004fighterA.png",
      "warrior_a":    "GR-006warriorA.png",
      "lancer_a":     "GR-008ancerA.png",
      "archer_a":     "GR-012archerA.png",
      "warrior_03":   "GR-013-warior03.png",
      "elf_a":        "GR-014elfA.png",
      "grappler_a":   "GR-018grapplerA.png",
      "cleric_a":     "GR-022clericA.png",
      "archer_01":    "GR-breeze-archer01.png",
      "mage_01":      "GR-breeze-mage01.png",
      "merchant_01":  "GR-breeze-merchant01.png",
      "thief_01":     "GR-breeze-thief01-1.png",
      "warrior_01":   "GR-breeze-warior01-2.png",
      "fighter_b":    "GR-005fighterB.png",
      "warrior_b":    "GR-007warriorB.png",
      "lancer_b":     "GR-009lancerB.png",
      "mage_02":      "GR-breeze-mage02.png",
      "fighter_02":   "GR-breeze-fighter02-1.png",
      "clown_01":     "GR-breeze-clown01.png",
      "soldier_01":   "GR-breeze-soldier01.png",
      "soldier_02":   "GR-breeze-soldier02.png",
      "soldier_03":   "GR-breeze-soldier03-1.png",
      "soldier_04":   "GR-breeze-soldier04.png",
      "pandaman":     "GR-pandaman.png",
      "flora_red":    "GR-000flora02.png",
      "ghost_short":  "GR-000ghost01.png",
      "slime_yellow": "GR-000slime04.png",
      "catsith":      "GR-breeze-cat01.png",
      "flora_purple": "GR-breeze-flora.png",
      "ghost_tall":   "GR-breeze-ghost.png",
      "shade":        "GR-breeze-shade.png",
      "slime_green":  "GR-breeze-slime02.png",
      "slime_red":    "GR-breeze-slime.png",
      "snowman":      "GR-breeze-snowman.png",
      "panda":        "GR-panda.png"
    },
    "tilesetImages": {
      "icy": "Gratheo-breezeicyyj9.png"
    }
  },
  tilesets: {
    'icy': '/tilesets/icy.json'
  },
  maps: {
    'Winter Wonderland': '/maps/winter_wonderland.json'
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
    
    var $container = $(game.sketch.container);
    var containerOffset = $container.offset();
    $container.on('click', function (event) {
      game.player.x = event.pageX - containerOffset.left;
      game.player.y = event.pageY - containerOffset.top;
      game.entitiesChanged = true;
    });
    
  }
});

  

});

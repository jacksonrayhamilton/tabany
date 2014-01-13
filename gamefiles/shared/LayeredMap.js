define(['shared/Tilemap'],
function (Tilemap) {
  
  'use strict';
  
  /*
   * An collection of Tilemaps that, when laid in their specified order, with
   * a Tileset to reference, compose the complete image of a slice of the
   * game world.
   * 
   * Will typically be loaded from a JSON file in shared/maps/.
   */
  var LayeredMap = {
    
    init: function (args) {
      
      this.name = args.name;
      
      // Array of arrays of Tilemaps.
      // If initializing from JSON, don't forget to call initLayers().
      this.layers = args.layers;
      
      // WARNING: This is sometimes a string. createMap should handle the
      // automatic linking of Maps to Tilesets, but be careful anyway.
      this.tileset = args.tileset;
      
      this.width = args.width;
      this.height = args.height;
      
      // It is supposed that there will be an alpha-less ground layer,
      // and then a layer of with alpha with no "protruding" Tilemaps,
      // and then Tilemaps and Entities will be intermixed on the next
      // layer up.
      this.entityLayer = (typeof args.entityLayer === 'undefined') ? 2 : args.entityLayer;
      
      this.generateImpassibilityMap();
      
      return this;
    },
    
    toJSON: function () {
      return {
        name: this.name,
        layers: this.layers,
        tileset: this.tileset.name,
        width: this.width,
        height: this.height,
        entityLayer: this.entityLayer
      };
    },
    
    // Automatically initializes all of this Map's layers as Tilemaps.
    // This is needed after initializing from JSON.
    // CONSIDER: Recursive searching of arbitrarily-deep nested layers?
    // (Oh dear god please no.)
    initLayers: function () {
      var l, lLen, layer, t, tLen;
      for (l = 0, lLen = this.layers.length; l < lLen; l++) {
        layer = this.layers[l];
        for (t = 0, tLen = layer.length; t < tLen; t++) {
          layer[t] = Object.create(Tilemap).init(layer[t]);
        }
      }
    },
    
    // Examines all Tilemaps in all layers a returns a flat mapping of the
    // all relevant impassibilities. Optimizes collision detection by only
    // presenting the engine with the highest overriding passibility of any
    // given space that has layers of tiles in it.
    generateImpassibilityMap: function () {
      var impassibilityMap, layers, tileset, l, lLen,
      tilemaps, ts, tsLen,
      tilemap, tiles, t, tLen,
      tile, tilemapWidth, relativeTilePosition;
      
      this.impassibilityMap = {};
      impassibilityMap = this.impassibilityMap;
      layers = this.layers;
      tileset = this.tileset;
      
      for (l = 0, lLen = layers.length; l < lLen; l++) {
        tilemaps = layers[l];
        for (ts = 0, tsLen = tilemaps.length; ts < tsLen; ts++) {
          tilemap = tilemaps[ts];
          tiles = tilemap.tiles;
          // CONSIDER: Tilemaps with lots of undefined indexes are imperformant.
          // Not much that can be done really, except to compress maps smartly
          // when designing them.
          for (t = 0, tLen = tiles.length; t < tLen; t++) {
            tile = tileset.getTile(tiles[t]);
            if (tile && tile.impassible) {
              tilemapWidth = tilemap.width;
              relativeTilePosition = ((tilemap.y + Math.floor(t / tilemapWidth)) * this.width) + tilemap.x + (t % tilemapWidth);
              impassibilityMap[relativeTilePosition] = tile.impassible;
            }
          }
        }
      }
    }
  };
  
  return LayeredMap;
});

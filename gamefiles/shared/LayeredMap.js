define(
function () {
  
  'use strict';
  
  var LayeredMap = {
    
    init: function (args) {
      this.layers = args.layers; // Array of arrays of tilemaps
      this.tileset = args.tileset;
      this.width = args.width;
      this.height = args.height;
      // It is supposed that there will be an alpha-less ground layer and then
      // small Tilemaps and Entities will be intermixed on the next layer up.
      this.entityLayer = (typeof args.entityLayer === 'undefined') ? 2 : args.entityLayer;
      this.generateImpassibilityMap();
      return this;
    },
    
    // NOTE: Higher tilemaps' impassible arrays override
    // those of lower tilemaps!
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

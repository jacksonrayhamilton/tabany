define(
function () {
  
  'use strict';
  
  var LayeredMap = {
    init: function (layers, tileset, width, height, entityLayer) {
      this.layers = layers; // Array of arrays of tilemaps
      this.tileset = tileset;
      this.width = width;
      this.height = height;
      this.entityLayer = (typeof entityLayer === 'undefined') ? 1 : entityLayer;
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

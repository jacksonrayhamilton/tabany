define(
function () {
  
  'use strict';
  
  var Tileset = {
    
    init: function (tiles, image, width, height, tileSize) {
      this.tiles = tiles;
      // String corresponding to the name of a TilesetImage
      this.image = image;
      this.width = width;
      this.height = height;
      this.tileSize = (typeof tileSize === 'undefined') ? 32 : tileSize;
      this.generateCoordinates();
      return this;
    },
    
    /*initFromJSON: function (json) {
      var tileSize;
      tileSize = (typeof json.tileSize === 'undefined') ? 32 : tileSize;
      return this.init(json.tiles, json.image, json.width, json.height, tileSize);
    },*/
    
    // CONSIDER: Think about porting this elsewhere (Tilemaps?) for performance.
    generateCoordinates: function () {
      var tiles, width, tileSize, i, len;
      tiles = this.tiles;
      width = this.width;
      tileSize = this.tileSize;
      for (i = 0, len = tiles.length; i < len; i++) {
        tiles[i].coordinates = [
          (i % width) * tileSize,
          Math.floor(i / width) * tileSize
        ];
      }
    },
    
    getTile: function (index) {
      return this.tiles[index];
    }
  };
  
  return Tileset;
});



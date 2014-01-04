define(['app/Tile'],
function (Tile) {
  
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
    
    /*fromJSON: function(json) {
      
    },*/
    
    generateCoordinates: function () {
      var i, len, tiles, width, tileSize, tileXY;
      tiles = this.tiles;
      width = this.width;
      tileSize = this.tileSize;
      for (i = 0, len = tiles.length; i < len; i++) {
        tileXY = Tile.getXY(i, width);
        tiles[i].coordinates = [
          tileXY[0] * tileSize,
          tileXY[1] * tileSize
        ];
      }
    },
    
    getTile: function (index) {
      return this.tiles[index];
    }
  };
  
  return Tileset;
});



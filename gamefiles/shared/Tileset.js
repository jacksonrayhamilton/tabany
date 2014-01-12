define(
function () {
  
  'use strict';
  
  var Tileset = {
    
    init: function (args) {
      this.tiles = args.tiles;
      this.image = args.image; // String corresponding to the name of a TilesetImage
      this.width = (typeof args.width === 'undefined') ? 8 : args.width;
      // Specifying the height is pointless, and you may even
      // measure it incorrectly. But you still can if you really want to.
      if (typeof args.height === 'undefined') {
        this.height = Math.ceil(this.tiles.length / this.width);
      } else {
        this.height = args.height;
      }
      this.tileSize = (typeof args.tileSize === 'undefined') ? 32 : args.tileSize;
      this.generateCoordinates();
      return this;
    },
    
    // CONSIDER: Think about porting this elsewhere (Tilemaps?) for performance.
    // (To avoid recalculating coordinates constantly.)
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



define(
function () {
  
  'use strict';
  
  var Tileset = {
    
    init: function (args) {
      this.name = args.name;
      this.tiles = args.tiles;
      this.image = args.image; // String corresponding to the name of a TilesetImage
      this.width = (typeof args.width === 'undefined') ? 8 : args.width;
      if (typeof args.height === 'undefined') {
        this.height = Math.ceil(this.tiles.length / this.width);
      } else {
        this.height = args.height;
      }
      this.tileSize = (typeof args.tileSize === 'undefined') ? 32 : args.tileSize;
      this.generateCoordinates();
      return this;
    },
    
    toJSON: function () {
      return {
        name: this.name,
        tiles: this.tiles,
        image: this.image,
        width: this.width,
        height: this.height,
        tileSize: this.tileSize
      };
    },
    
    // TODO: Use a separate coordinates array instead.
    // CONSIDER: Think about porting this elsewhere (Tilemaps?) for performance.
    // (To avoid recalculating coordinates constantly.)
    generateCoordinates: function () {
      var width, tileSize, i, len;
      width = this.width;
      tileSize = this.tileSize;
      this.coordinates = [];
      for (i = 0, len = this.tiles.length; i < len; i++) {
        this.coordinates[i] = [
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



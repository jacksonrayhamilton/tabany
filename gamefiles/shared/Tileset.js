define(
function () {
  
  'use strict';
  
  /*
   * Provides data to logically-supplement a TilesetImage.
   * 
   * You can have a picture of a rock, sure, but that rock has to be
   * explicitly defined as a solid object that can't be passed through.
   * This is what Tilesets are for.
   * 
   * Contains properties corresponding to the tiles on a TilesetImage.
   * These properties are ordered by their coordinates.
   * 
   * Currently manages whether certain tiles are impassible (or only
   * impassible from certain directions).
   * 
   * Will typically be loaded from a JSON file in shared/tilesets/.
   * 
   * (See client/images/tilesets/ for examples of TilesetImages.)
   */
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



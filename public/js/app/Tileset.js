define(['app/Tile'],
function (Tile) {
  
  var Tileset = {
    
    init: function (tiles, image, tileSize) {
      this.tiles = tiles;
      this.image = image;
      this.tileSize = (typeof tileSize === 'undefined') ? 32 : tileSize;
      this.width = this.image.width / this.tileSize;
      this.height = this.image.height / this.tileSize;
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
    }
  };
  
  return Tileset;
});



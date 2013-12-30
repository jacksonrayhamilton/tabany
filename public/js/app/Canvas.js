define(['app/Tile'],
function (Tile) {
  
  var Canvas = {
    
    init: function (el, width, height) {
      if (el === null) {
        el = document.createElement('canvas');
        el.width = width;
        el.height = height;
      }
      this.el = el;
      this.width = this.el.width;
      this.height = this.el.height;
      this.ctx = this.el.getContext('2d');
      return this;
    },
    
    draw: function (image, x, y) {
      this.ctx.drawImage(image, x, y);
    },
    
    drawSlice: function (image, sx, sy, sWidth, sHeight, dx, dy) {
      this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, sWidth, sHeight);
    },
    
    drawTilemap: function (tilemap) {
      var width, tileset, image, tileSize, i, len, tile, tileXY, coordinates;
      width = tilemap.width;
      tileset = tilemap.tileset;
      image = tileset.image;
      tileSize = tileset.tileSize;
      for (i = 0, len = tilemap.tiles.length; i < len; i++) {
        tile = tilemap.getTile(i);
        if (tile) {
          tileXY = Tile.getXY(i, width);
          coordinates = tile.coordinates;
          this.drawSlice(
            image,
            coordinates[0], coordinates[1],
            tileSize, tileSize,
            tileXY[0] * tileSize, tileXY[1] * tileSize
          );
        }
      }
    }
    
  };
  
  return Canvas;
});

generateCoordinates: function () {
  var tileSize, w, h, x, y, pixelX, pixelY;
  
  tileSize = this.tileSize;
  w = this.width;
  h = this.height;
  pixelX = 0;
  pixelY = 0;
  
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      this.tiles[x + y].coordinates = [pixelX, pixelY];
      pixelX += tileSize;
    }
    pixelX = 0;
    pixelY += tileSize;
  }
},

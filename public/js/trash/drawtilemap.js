drawTilemap: function (tilemap) {
  var image, w, h, y, x, tile, tileSize, coordinates;
  image = tilemap.tileset.image;
  w = tilemap.width;
  h = tilemap.height;
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      tile = tilemap.getTile(x, y);
      // Ignore null tiles
      if (tile) {
        tileSize = tilemap.tileset.tileSize
        coordinates = tile.coordinates;
        this.drawSlice(
          image,
          coordinates[0], coordinates[1],
          tileSize, tileSize,
          x * tileSize, y * tileSize
        );
      }
    }
  }
}

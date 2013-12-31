sketch.loadImages({
  desert: tilesets.desert
}, function () {
  var main, layer0, tileset, i, tWidth, tHeight;
  
  main = this.canvases.main;
  layer0 = this.createCanvas('layer0', main.width, main.height);
  
  tileset = this.images.desert;
  
  tWidth = layer0.width / 32;
  tHeight = layer0.height / 32;
  
  for (i = 0; i < tWidth; i++) {
    layer0.drawSlice(this.images.desert, 0, 0, 32, 32, i * 32, 0);
  }
  
  this.canvases.main.drawSlice(layer0.el, 0, 0, tWidth * 32, 32, 0, 0);
  
});





var myTilemap0 = Object.create(Tilemap).init(myTilemapTiles0, 20, 15);
var myTilemap1 = Object.create(Tilemap).init(myTilemapTiles1, 20, 15);
var main = sketch.canvases.main;
var rendering = sketch.canvases.rendering;
main.drawTilemap(myTilemap0, icy);
rendering.drawTilemap(myTilemap1, icy);
main.drawImage(rendering.el, 0, 0);




var well0 = Object.create(Tilemap).init(wellTiles, 2, 2, 5, 3);
var well1 = Object.create(Tilemap).init(wellTiles, 2, 2, 6, 7);
main.drawTilemap(well0, icy);
main.drawTilemap(well1, icy);

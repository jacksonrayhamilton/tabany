define(
function () {
  
  var LayeredMap = {
    init: function (layers, tileset, width, height, entityLayer) {
      this.layers = layers; // Array of arrays of tilemaps
      this.tileset = tileset;
      this.width = width;
      this.height = height;
      this.entityLayer = (typeof entityLayer === 'undefined') ? 1 : entityLayer;
      return this;
    }
  };
  
  return LayeredMap;
});

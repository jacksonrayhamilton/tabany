define(
function () {
  
  var Tilemap = {
    
    // TODO: Rename `tiles` to something more descriptive
    init: function (tiles, tileset, width, height) {
      this.tiles = tiles;
      this.tileset = tileset;
      this.width = width;
      this.height = height;
      return this;
    },
    
    /*fromJSON: function(json) {
      
    },*/
    
    getTile: function (index) {
      return this.tileset.tiles[this.tiles[index]];
    }
  };
  
  return Tilemap;
});



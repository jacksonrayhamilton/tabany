define(
function () {
  
  var Tilemap = {
    
    // TODO: Rename `tiles` to something more descriptive
    init: function (tiles, width, height, x, y, base) {
      this.tiles = tiles;
      this.width = width;
      this.height = height;
      this.x = (typeof x === 'undefined') ? 0 : x;
      this.y = (typeof y === 'undefined') ? 0 : y;
      // The southmost tile of the Tilemap, inclusive.
      // Used for ordering.
      this.base = (typeof base === 'undefined') ? this.y + this.height - 1 : base;
      return this;
    },
    
    /*fromJSON: function(json) {
      
    },*/
  };
  
  return Tilemap;
});



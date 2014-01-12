define(
function () {
  
  'use strict';
  
  var Tilemap = {
    
    // TODO: Rename `tiles` to something more descriptive
    init: function (args) {
      
      this.tiles = args.tiles;
      this.width = args.width;
      if (typeof args.height === 'undefined') {
        this.height = Math.ceil(this.tiles.length / this.width);
      } else {
        this.height = args.height;
      }
      this.x = (typeof args.x === 'undefined') ? 0 : args.x;
      this.y = (typeof args.y === 'undefined') ? 0 : args.y;
      
      // The southmost tile of the Tilemap, inclusive. Used for ordering.
      // Allows for things like trees to be interwoven with Entities.
      //
      // Can be manually set to 0 to make all tiles be drawn in the
      // background. Good for batches of tiles on layers > 0 that have
      // alpha but which don't stick up.
      //
      // Can also be set to the map height to make tiles "raised" (appear
      // above everything). However it would probably be smarter to put
      // raised tiles in another layer so they can all be cached together.
      if (typeof args.base === 'undefined') {
        this.base = this.y + this.height - 1;
      } else {
        this.base = args.base;
      }
      
      return this;
    }
  };
  
  return Tilemap;
});

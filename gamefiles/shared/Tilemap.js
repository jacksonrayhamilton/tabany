define(
function () {
  
  'use strict';
  
  /*
   * An arbitrarily-sized array of "tiles", which when paired with a 
   * Tileset construct an cohensive large image out of slices of the
   * Tileset. More simply, a section or a "thing" on a LayeredMap.
   * 
   * Tilemaps can be used for all the sand in your desert, or all the
   * snow on your ground, or for a cactus, or for a tree.
   * 
   * There would probably be 1 Tilemap for each of the aforementioned
   * items, although for items that don't "protrude" you could batch them
   * all into a single Tilemap.
   * 
   *   Example:
   *   - All of the following Tilemaps, when composed together, make up a
   *     desert landscape.
   *   - All the ground sand tiles, and all the footstep-in-the-sand tiles,
   *     go into the first Tilemap.
   *   - All the small rocks, flowers, bulbous cacti etc can be mashed into
   *     the next Tilemap. (None of these things are large enough to "protrude"
   *     upwards with a height of 2 or more tiles.)
   *   - Next up, EACH tall cactus, large bovine skeleton, oasis tree etc
   *     gets its OWN Tilemap.
   * 
   * It's just assumed that all tiles in a Tilemap are part of the same
   * "structure", persay.
   * 
   * Because Tilemaps are treated like "structures" (physical things rising
   * on the Z of a plane) they can be intermixed with Entities in the same
   * drawing and appear either behind or in front of those Entities.
   * As would be expected of a cactus or a tree.
   * 
   * But a Tilemap could also just as easily be a large stretch of ground
   * that isn't intermixed with anything, or a canopy cover that overlays
   * the map. If this is the intention then the Tilemap should be in its
   * own layer (a non-Entity layer, so Sketch won't bother trying to
   * intermix it) or have its base explicitly set.
   */
  var Tilemap = {
    
    // TODO: Rename `tiles` to something more descriptive, maybe.
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
      // Can be manually set to 0 to make all tiles be "suppressed" to
      // background of this Tilemap's layer. Can also be set to the map
      // height to make tiles "raised" (appear above everything).
      //
      // However, it would probably be smarter to just put suppressed or
      // raised tiles in another layer. In the future this may also offer
      // the optimization of caching those suppressed or raised Tiles into
      // a flat image.
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

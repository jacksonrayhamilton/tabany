define(
function () {
  
  'use strict';
  
  var Tile = {
    // CONSIDER: Remove this function and instead generate XYs at the
    // Tilemap level?
    getXY: function (index, width) {
      return [index % width, Math.floor(index / width)];
    }
  };
  
  return Tile;
});

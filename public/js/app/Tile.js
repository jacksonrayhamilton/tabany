define(
function () {
  
  var Tile = {
    getXY: function (index, width) {
      return [index % width, Math.floor(index / width)];
    }
  };
  
  return Tile;
});

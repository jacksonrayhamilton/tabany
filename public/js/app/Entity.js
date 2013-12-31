define(
function () {
  
  var Entity = {
    init: function (x, y, image, orientation) {
      this.x = x;
      this.y = y;
      this.image = image;
      this.orientation = orientation; // 0, 1, 2, 3 for directions
      return this;
    },
    getTileBase: function (tileSize) {
      return Math.floor(this.y / tileSize);
    },
    move: function () {
      
    }
  };
  
  return Entity;
});

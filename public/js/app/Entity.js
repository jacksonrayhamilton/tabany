define(
function () {
  
  var Entity = {
    init: function (x, y, baseX, baseY, image, orientation) {
      this.x = x;
      this.y = y;
      this.baseX = baseX;
      this.baseY = baseY;
      this.image = image;
      this.width = Math.floor(image.width / 4);
      this.height = Math.floor(image.height / 4);
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

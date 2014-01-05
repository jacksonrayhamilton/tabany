define(
function () {
  
  var Entity = {
    init: function (x, y, width, height, image, direction, movementRate, frameRate) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.image = image;
      this.direction = direction;
      this.movementRate = movementRate;
      this.frameRate = frameRate;
      this.speed = 1;
      // this.game = null;
      return this;
    },
    
    toJSON: function () {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        image: this.image,
        direction: this.direction,
        movementRate: this.movementRate,
        frameRate: this.frameRate,
        speed: this.speed
      };
    }
  };
  
  return Entity;
});

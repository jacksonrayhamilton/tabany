define(
function () {
  
  var Entity = {
    
    init: function (x, y, width, height, image, direction, pixelRate, moveRate, frameRate) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.image = image;
      this.direction = direction;
      this.pixelRate = pixelRate
      this.moveRate = moveRate;
      this.frameRate = frameRate;
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
        pixelRate: this.pixelRate,
        moveRate: this.moveRate,
        frameRate: this.frameRate
      };
    }
  };
  
  return Entity;
});

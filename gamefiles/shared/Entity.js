define(['shared/Util', 'shared/Tile'],
function (Util, Tile) {
  
  'use strict';
  
  var Entity = {
    
    init: function (x, y, width, height, image, direction, pixelRate, moveRate, frameRate) {
      
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      // String corresponding to the name of an EntityImage.
      this.image = image;
      this.setDirection(direction);
      this.pixelRate = pixelRate;
      this.moveRate = moveRate;
      this.frameRate = frameRate;
      
      if (Util.inBrowser()) {
        this.frame = 0; // 0..3
        this.nextFrameCount = 0;
      }
      
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
    },
    
    setDirection: function (direction) {
      this.direction = direction;
      switch (direction) {
        case 'left': this.directionRow = 1; break;
        case 'up': this.directionRow = 3; break;
        case 'right': this.directionRow = 2; break;
        case 'down': this.directionRow = 0; break;
      }
    },
    
    getTileBase: function (tileSize) {
      return Math.floor((this.y + this.height - 1) / tileSize);
    },
    
    nextFrame: function () {
      if (this.nextFrameCount === this.frameRate) {
        var frame = this.frame += 1;
        this.frame = (frame > 3) ? 0 : frame;
        this.nextFrameCount = 0;
      }
      this.nextFrameCount += 1;
    }
    
  };
  
  return Entity;
});

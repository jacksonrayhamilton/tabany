define(['underscore',
        'shared/Types'],
function (_,
          Types) {
  
  'use strict';
  
  var Entity = {
    
    type: Types.Objects.Entity,
    
    init: function (args) {
      args = args || {};
      
      this.id = args.id;
      this.x = args.x;
      this.y = args.y;
      this.width = args.width;
      this.height = args.height;
      // String corresponding to the name of an EntityImage.
      this.image = args.image;
      this.setDirection(args.direction);
      this.pixelRate = args.pixelRate || 1;
      this.moveRate = args.moveRate || 10;
      this.frameRate = args.frameRate || 15;
      
      // These properties may be browser-only.
      this.frame = 0; // 0..3
      this.nextFrameCount = 0;
      
      return this;
    },
    
    toJSON: function () {
      return {
        type: this.type,
        id: this.id,
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
      } else {
        this.nextFrameCount += 1;
      }
    }
    
  };
  
  return Entity;
});

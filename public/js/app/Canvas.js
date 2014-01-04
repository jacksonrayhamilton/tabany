define(['app/Tile'],
function (Tile) {
  
  'use strict';
  
  var Canvas = {
    
    init: function (el, width, height) {
      if (el === null) {
        el = document.createElement('canvas');
        el.width = width;
        el.height = height;
      }
      this.el = el;
      this.width = this.el.width;
      this.height = this.el.height;
      this.ctx = this.el.getContext('2d');
      return this;
    },
    
    drawImage: function (image, x, y) {
      this.ctx.drawImage(image, x, y);
    },
    
    drawSlice: function (image, sx, sy, sWidth, sHeight, dx, dy) {
      this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, sWidth, sHeight);
    }
  };
  
  return Canvas;
});

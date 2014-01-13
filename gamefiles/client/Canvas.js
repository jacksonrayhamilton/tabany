define(
function () {
  
  'use strict';
  
  /*
   * A very light abstraction layer for dealing with HTMLCanvasElements and
   * their contexts.
   */
  var Canvas = {
    
    init: function (el, width, height) {
      // Optionally set el to a preexisting canvas element.
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
    
    // Wrapper for ctx.drawImage(), the first form.
    drawImage: function (image, x, y) {
      this.ctx.drawImage(image, x, y);
    },
    
    // Wrapper for ctx.drawImage(), the third form.
    drawSlice: function (image, sx, sy, sWidth, sHeight, dx, dy) {
      this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, sWidth, sHeight);
    }
  };
  
  return Canvas;
});

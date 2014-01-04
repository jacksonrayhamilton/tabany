define(['underscore', 'app/Canvas', 'app/ImageLoader'],
function (_, Canvas, ImageLoader) {
  
  'use strict';
  
  var Sketch = {
    
    init: function (container) {
      if (!container) {
        container = document.getElementById('SketchCanvasesContainer');
      }
      container.style.position = 'relative';
      this.container = container;
      this.canvases = {};
      this.images = {};
      return this;
    },
    
    loadImages: function (srcs, callback) {
      ImageLoader.loadImages(this.images, srcs, callback);
    },
    
    addCanvas: function (name, el) {
      var canvas = Object.create(Canvas).init(el);
      this.canvases[name] = canvas;
      return canvas;
    },
    
    createCanvas: function (name, width, height) {
      var canvas = Object.create(Canvas).init(null, width, height);
      this.canvases[name] = canvas;
      return canvas;
    },
    
    appendCanvasToContainer: function (name, zIndex) {
      var el = this.canvases[name].el;
      el.style.position = 'absolute';
      el.style.zIndex = (typeof zIndex === 'undefined') ? 0 : zIndex;
      this.container.appendChild(el);
    }
    
  };
  
  return Sketch;
});

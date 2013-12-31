define(['underscore', 'app/Canvas', 'app/ImageLoader'],
function (_, Canvas, ImageLoader) {
  
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
    
    // CONSIDER: Remove this completely?
    loadImages: function (srcs, callback) {
      ImageLoader.loadImages(srcs, function (images) {
        _.extend(this.images, images); // PERF?
        callback.call(this);
      }.bind(this));
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
    
    appendCanvas: function (name, zIndex) {
      var el = this.canvases[name].el;
      el.style.position = 'absolute';
      el.style.zIndex = (typeof zIndex === 'undefined') ? 0 : zIndex;
      this.container.appendChild(el);
    }
    
  };
  
  return Sketch;
});

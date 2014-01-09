define(
function () {
  
  'use strict';
  
  var LoadableImage = {
    
    init: function (args) {
      var src;
      args = args || {};
      src = args.src;
      
      this.src = src;
      this.loading = false;
      this.loaded = false;
    },
    
    // Loads the image and executes a callback on completion.
    load: function () {
      var image;
      this.loading = true;
      image = new Image();
      image.addEventListener('load', (function () {
        this.onLoad(image);
        this.loading = false;
        this.loaded = true;
      }).bind(this), false);
      image.src = this.src;
    },
    
    onLoad: function (image) {
    }
    
  };
  
  return LoadableImage;
});

define(
function () {
  
  'use strict';
  
  /*
   * A lazily-loaded image. Stores information about an image and is intended
   * to sit in memory until the image actually needs to be displayed. Then
   * its load event fires and its image is loaded asynchronously.
   * 
   * Whatever method attempts to use the image will have to silently fail
   * a couple times until the asynchronous loading completes.
   * 
   * This design is preferable to loading a ton of images immediately on
   * joining the game.
   */
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

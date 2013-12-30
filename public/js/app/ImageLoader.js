define(
function () {
  
  var ImageLoader = {
  
    // Loads a single image and executes a callback on completion
    loadImage: function (src, onImageLoad) {
      var image = new Image();
      image.addEventListener('load', function () {
        onImageLoad(image);
      }, false);
      image.src = src;
    },
    
    // Loads an array of images and executes a callback after the last
    // one's completion.
    // If an array is passed, returns an array of HTMLImageElements.
    // If an object is passed, `srcs` is assumed to be a dictionary of
    // image sources. The returned value will be a dictionary
    // of HTMLImageElements.
    loadImages: function (srcs, onImagesLoad) {
      var images, numSrcs, numLoaded, i, len, image;
      
      // Create an array of HTMLImageElements.
      if (Array.isArray(srcs)) {
        images = [];
      
        for (i = 0, len = srcs.length; i < len; i++) {
          this.loadImage(srcs[i], function (image) {
            images.push(image);
            if (images.length === len) {
              onImagesLoad(images);
            }
          });
        }
      }
      // Create a dictionary of HTMLImageElements.
      else {
        // CONSIDER: Allow object to be passed in that
        // can just have properties slapped on? (Performance, avoid copying.)
        images = {};
        numSrcs = Object.keys(srcs).length;
        numLoaded = 0;
        
        for (name in srcs) {
          ImageLoader.loadImage(srcs[name], function (image) {
            images[name] = image;
            numLoaded++;
            if (numLoaded === numSrcs) {
              onImagesLoad(images);
            }
          });
        }
      }
    }
  
  };
  
  return ImageLoader;
});

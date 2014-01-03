define(
function () {
  
  'use strict';
  
  var ImageLoader = {
    
    // Loads images from a dictionary of name and src pairs.
    // Then merges the resultant HTMLImageElements into a dictionary
    // of name and HTMLImageElement pairs. Also passes that
    // dictionary to a callback.
    loadImages: function (container, srcs, callback) {
      var numSrcs, numLoaded, name;
      
      if (container === null) {
        container = Object.create(null);
      }
      numSrcs = Object.keys(srcs).length;
      numLoaded = 0;
      
      for (name in srcs) {
        var image = new Image();
        image.addEventListener('load', (function () {
          var boundName = name;
          var boundImage = image;
          return function () {
            container[boundName] = boundImage;
            numLoaded++;
            if (numLoaded === numSrcs) {
              callback(container);
            }
          };
        }()), false);
        image.src = srcs[name];
      }
    }
  
  };
  
  return ImageLoader;
});

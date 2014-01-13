define(['shared/inherits',
        'client/LoadableImage'],
function (inherits,
          LoadableImage) {
  
  'use strict';
  
  /*
   * A lazily-loaded image of an Entity, see LoadableImage.
   */
  var EntityImage = inherits(LoadableImage, {
    
    DIRECTORY: '/gamefiles/client/images/entities/',
    
    init: function (applySuper, args) {
      applySuper(this, arguments);
      return this;
    },
    
    onLoad: function (image) {
      var width, height;
      
      width = image.width;
      height = image.height;
      
      this.image = image;
      this.width = width;
      this.height = height;
      this.spriteWidth = Math.floor(width / 4);
      this.spriteHeight = Math.floor(height / 4);
    }
    
  });
  
  return EntityImage;
});

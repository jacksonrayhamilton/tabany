define(['app/ImageLoader'],
function (ImageLoader) {
  
  'use strict';
  
  var TilesetImage = {
    
    // Width and height are supplied so that Tilesets can still be drawn
    // without their images hanging the engine.
    init: function (src) {
      
      // Asynchronously load the Spriteset's image.
      ImageLoader.loadImage(src, function (image) {
        this.image = image;
      }.bind(this));
      
      return this;
    }
  };
  
  return TilesetImage;
});



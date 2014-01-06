define(['client/ImageLoader'],
function (ImageLoader) {
  
  var EntityImage = {
    
    // Width and height are supplied so that Entities can still be drawn
    // without their images hanging the engine.
    init: function (src) {
      
      // Asynchronously load the Spriteset's image.
      ImageLoader.loadImage(src, function (image) {
        var width, height;
        
        width = image.width;
        height = image.height;
        
        this.image = image;
        this.width = width;
        this.height = height;
        this.spriteWidth = Math.floor(width / 4);
        this.spriteHeight = Math.floor(height / 4);
      }.bind(this));
      
      return this;
    }
  };
  
  return EntityImage;
});

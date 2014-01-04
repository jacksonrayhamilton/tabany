define(['app/ImageLoader'],
function (ImageLoader) {
  
  var Spriteset = {
    
    // Width and height are supplied so that Entities can still be drawn
    // without their images hanging the engine.
    init: function (name, src, width, height) {
      
      this.name = name;
      this.width = width;
      this.height = height;
      this.spriteWidth = Math.floor(width / 4);
      this.spriteHeight = Math.floor(height / 4);
      
      // Asynchronously load the Spriteset's image.
      ImageLoader.loadImage(src, function (image) {
        this.image = image;
      }.bind(this));
      
      return this;
    }
    W
  };
  
  return Spriteset;
});

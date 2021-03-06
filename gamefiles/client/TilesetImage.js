define(['shared/inherits',
        'client/LoadableImage'],
function (inherits,
          LoadableImage) {
  
  'use strict';
  
  /*
   * A lazily-loaded image of a Tileset, see LoadableImage.
   */
  var TilesetImage = inherits(LoadableImage, {
    
    DIRECTORY: '/gamefiles/client/images/tilesets/',
    
    init: function (applySuper, args) {
      applySuper(this, arguments);
      return this;
    },
    
    onLoad: function (image) {
      this.image = image;
    }
    
  });
  
  return TilesetImage;
});



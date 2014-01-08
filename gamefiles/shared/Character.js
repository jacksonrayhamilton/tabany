define(['shared/Entity', 'shared/inherits'],
function (Entity, inherits) {
  
  var Character = inherits(Entity, {
    
    init: function (applySuper, x, y, width, height, image, direction, pixelRate, moveRate, frameRate) {
      
      applySuper(this, arguments);
      return this;
    }
    
  });
  
  return Character;
});

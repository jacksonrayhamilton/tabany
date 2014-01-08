define(['shared/Character', 'shared/inherits'],
function (Character, inherits) {
  
  var PlayerCharacter = inherits(Character, {
    init: function (applySuper, x, y, width, height, image, direction, pixelRate, moveRate, frameRate, name, sex) {
      
      applySuper(this, arguments);
      this.name = name;
      this.sex = sex;
      
      return this;
    }
  });
  
  return PlayerCharacter;
});

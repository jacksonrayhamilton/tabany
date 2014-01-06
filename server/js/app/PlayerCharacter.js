define(['app/Character', 'app/inherits'],
function (Character, inherits) {
  
  var PlayerCharacter = inherits(Character, {
    init: function (x, y, width, height, image, direction, pixelRate, moveRate, frameRate, name, sex) {
      
      Character.init.apply(this, Array.prototype.slice.call(arguments));
      this.name = name;
      this.sex = sex;
      
      return this;
    }
  });
  
  return PlayerCharacter;
});

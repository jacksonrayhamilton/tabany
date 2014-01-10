define(['shared/Character', 'shared/inherits'],
function (Character, inherits) {
  
  var PlayerCharacter = inherits(Character, {
    
    init: function (applySuper, args) {
      
      applySuper(this, arguments);
      this.name = args.name;
      this.sex = args.sex;
      
      return this;
    },
    
    toJSON: function () {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        image: this.image,
        direction: this.direction,
        pixelRate: this.pixelRate,
        moveRate: this.moveRate,
        frameRate: this.frameRate,
        name: this.name,
        sex: this.sex
      };
    }
    
  });
  
  return PlayerCharacter;
});

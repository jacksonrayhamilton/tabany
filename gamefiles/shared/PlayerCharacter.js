define(['underscore',
        'shared/Character', 'shared/inherits', 'shared/Types',
        'text!shared/player_names.json', 'text!shared/player_sprites.json'],
function (_,
          Character, inherits, Types,
          playerNamesJSON, playerSpritesJSON) {
  
  var PlayerCharacter = inherits(Character, {
    
    SEXES: ['male', 'female'],
    NAMES: JSON.parse(playerNamesJSON),
    SPRITES: JSON.parse(playerSpritesJSON),
    
    type: Types.Objects.PlayerCharacter,
    
    init: function (applySuper, args) {
      
      applySuper(this, arguments);
      this.name = args.name;
      this.sex = args.sex;
      if (args.color) this.color = args.color;
      
      return this;
    },
    
    toJSON: function () {
      return {
        type: this.type,
        id: this.id,
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
        sex: this.sex,
        color: this.color
      };
    },
    
    // Should only be invoked by PlayerCharacter.
    generateRandomCharacter: function (id, x, y, direction) {
      var sex, sexNames, name, sexSprites, index, spritePool, sprite, color;
      
      sex = this.SEXES[_.random(0, 1)];
      sexNames = this.NAMES[sex];
      name = sexNames[_.random(0, sexNames.length)];
      sexSprites = this.SPRITES[sex];
      
      // Get a random Sprite that is either of this Player's sex or which is
      // sexually-neutral.
      index = _.random(0, sexSprites.length + this.SPRITES.neutral.length - 1);
      spritePool;
      if (index < sexSprites.length) {
        spritePool = sexSprites;
      } else {
        spritePool = this.SPRITES.neutral;
        index -= sexSprites.length;
      }
      sprite = spritePool[index];
      
      // Get a random color.
      color = 'rgb(' + [
        _.random(34, 153),
        _.random(34, 153),
        _.random(34, 153)
      ].join(',') + ')';
      
      return Object.create(this).init({
        id: id, x: x, y: y, width: 16, height: 16,
        image: sprite, direction: direction,
        pixelRate: 1, moveRate: 10, frameRate: 15,
        name: name, sex: sex, color: color
      });
    }
    
  });
  
  return PlayerCharacter;
});

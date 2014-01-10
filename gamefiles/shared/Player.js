define(['underscore',
        'shared/PlayerCharacter',
        'text!shared/player_names.json', 'text!shared/player_sprites.json',],
function (_,
          PlayerCharacter,
          playerNamesJSON, playerSpritesJSON) {
  
  'use strict';
  
  var Player = {
    
    NAMES: JSON.parse(playerNamesJSON),
    SEXES: ['male', 'female'],
    SPRITES: JSON.parse(playerSpritesJSON),
    
    // This method has the side effect of creating a PlayerCharacter object.
    init: function (args) {
      args = args || {};
      
      this.uuid = args.uuid;
      if (args.color) {
        this.color = args.color;
      }
      if (args.character) {
        this.character = Object.create(PlayerCharacter).init(args.character);
      }
      
      return this;
    },
    
    generateRandomCharacter: function (x, y, direction) {
      var sex, sexNames, name, sexSprites, index, spritePool, sprite;
      
      sex = this.SEXES[_.random(0, 1)];
      sexNames = this.NAMES[sex];
      name = sexNames[_.random(0, sexNames.length)];
      sexSprites = this.SPRITES[sex];
      
      // Get a random Sprite that is either of this Player's sex or which is
      // sexually-neutral.
      index = _.random(0, sexSprites.length + this.SPRITES.neutral.length - 1);
      if (index < sexSprites.length) {
        spritePool = sexSprites;
      } else {
        spritePool = this.SPRITES.neutral;
        index -= sexSprites.length;
      }
      sprite = spritePool[index];
      
      this.character = Object.create(PlayerCharacter).init({
        x: x, y: y, width: 16, height: 16,
        image: sprite, direction: direction,
        pixelRate: 1, moveRate: 10, frameRate: 15,
        name: name, sex: sex
      });
    },
    
    generateRandomColor: function () {
      this.color = 'rgb(' + [
        _.random(34, 153),
        _.random(34, 153),
        _.random(34, 153)
      ].join(',') + ')';
    }
  };
  
  return Player;
});

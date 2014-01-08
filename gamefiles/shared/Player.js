define(['underscore',
        'shared/PlayerCharacter',
        'text!shared/player_names.json', 'text!shared/player_sprites.json',],
function (_,
          PlayerCharacter,
          playerNamesJSON, playerSpritesJSON) {
  
  'use strict';
  
  var NAMES = JSON.parse(playerNamesJSON),
      SEXES = ['male', 'female'],
      SPRITES = JSON.parse(playerSpritesJSON);
  
  var Player = {
    
    init: function (args) {
      args = args || {};
      var uuid = args.uuid;
      var character = args.character;
      
      this.uuid = uuid;
      if (character) {
        this.character = Object.create(PlayerCharacter).fromJSON(character);
      }
      
      return this;
    },
    
    // TODO: Remove after switching to object literal syntax, will be obsolete
    fromJSON: function (obj) {
      this.init.call(this, obj);
      return this;
    },
    
    generateRandomCharacter: function (x, y, direction) {
      var sex, sexNames, name, sexSprites, index, spritePool, sprite;
      
      sex = SEXES[_.random(0, 1)];
      sexNames = NAMES[sex];
      name = sexNames[_.random(0, sexNames.length)];
      sexSprites = SPRITES[sex];
      
      // Get a random Sprite that is either of this Player's sex or which is
      // sexually-neutral.
      index = _.random(0, sexSprites.length + SPRITES.neutral.length - 1);
      if (index < sexSprites.length) {
        spritePool = sexSprites;
      } else {
        spritePool = SPRITES.neutral;
        index -= sexSprites.length;
      }
      sprite = spritePool[index];
      
      this.character = Object.create(PlayerCharacter).init(x, y, 16, 16, sprite, direction, 1, 10, 15, name, sex);
    }
  };
  
  return Player;
});

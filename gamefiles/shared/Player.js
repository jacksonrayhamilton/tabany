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
    
    init: function (x, y) {
      var sex, sexNames, name, sexSprites, index, spritePool, sprite;
      
      this.generateUUID();
      
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
      
      this.character = Object.create(PlayerCharacter).init(x, y, 16, 16, sprite, 'down', 1, 10, 15, name, sex);
      
      return this;
    },
    
    // Source: http://stackoverflow.com/a/2117523/1468130
    generateUUID: (function () {
      var format, regex, callback;
      
      format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      regex = /[xy]/g;
      callback = function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      };
      
      return function () {
        this.uuid = format.replace(regex, callback);
      };
    }())
  };
  
  return Player;
});

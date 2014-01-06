define(['underscore', 'app/getUUID', 'app/PlayerCharacter', 'text!app/player_names.json', 'text!app/player_sprites.json',],
function (_, getUUID, PlayerCharacter, playerNamesJSON, playerSpritesJSON) {
  
  var names, sexes, sprites;
  names = JSON.parse(playerNamesJSON);
  sexes = ['male', 'female'];
  sprites = JSON.parse(playerSpritesJSON);
  
  var Player = {
    init: function (x, y) {
      var sex, sexNames, name, index, spritePool, sprite;
      
      this.uuid = getUUID();
      
      sex = sexes[_.random(0, 1)];
      sexNames = names[sex];
      name = sexNames[_.random(0, sexNames.length)];
      
      // Get a random Sprite that is either of this Player's sex or which is
      // sexually-neutral.
      index = _.random(0, sprites[sex].length + sprites.neutral.length - 1);
      if (index < sprites[sex].length) {
        spritePool = sprites[sex];
      } else {
        spritePool = sprites.neutral;
        index -= sprites[sex].length;
      }
      sprite = spritePool[index];
      
      this.character = Object.create(PlayerCharacter).init(x, y, 16, 16, sprite, 'down', 1, 10, 15, name, sex);
      
      return this;
    }
  };
  
  return Player;
});

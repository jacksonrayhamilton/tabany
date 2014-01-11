define(['underscore',
        'shared/Entity',
        'text!shared/player_names.json', 'text!shared/player_images.json'],
function (_,
          Entity,
          playerNamesJSON, playerImagesJSON) {
  
  'use strict';
  
  var Player = {
    
    SEXES: ['male', 'female'],
    NAMES: JSON.parse(playerNamesJSON),
    IMAGES: JSON.parse(playerImagesJSON),
    
    init: function (args) {
      args = args || {};
      
      this.uuid = args.uuid;
      if (args.entity) this.entity = args.entity;
      // Attempt to the set the entityId manually, then automatically.
      if (args.entityId) {
        this.entityId = args.entityId;
      } else if (args.entity) {
        this.entityId = this.entity.id;
      }
      if (args.sex) this.sex = args.sex;
      if (args.name) this.name = args.name;
      if (args.color) this.color = args.color;
      
      return this;
    },
    
    toJSON: function () {
      return {
        uuid: this.uuid,
        entityId: this.entityId,
        name: this.name,
        sex: this.sex,
        color: this.color
      };
    },
    
    generateRandomName: function () {
      var sexNames;
      
      this.sex = this.SEXES[_.random(0, 1)];
      sexNames = this.NAMES[this.sex];
      this.name = sexNames[_.random(0, sexNames.length)];
    },
    
    generateRandomEntity: function (args) {
      var sexImages, index, imagePool, image, color;
      
      args = args || {};
      
      sexImages = this.IMAGES[this.sex];
      
      // Get a random Image that is either of this Player's sex or which is
      // sexually-neutral.
      index = _.random(0, sexImages.length + this.IMAGES.neutral.length - 1);
      imagePool;
      if (index < sexImages.length) {
        imagePool = sexImages;
      } else {
        imagePool = this.IMAGES.neutral;
        index -= sexImages.length;
      }
      image = imagePool[index];
      
      this.entity = Object.create(Entity).init({
        id: args.id, x: args.x, y: args.y, width: 16, height: 16,
        image: image, direction: args.direction,
        pixelRate: 1, moveRate: 10, frameRate: 15
      });
      this.entityId = this.entity.id;
      
      return this.entity;
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

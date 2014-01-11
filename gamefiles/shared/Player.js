define(['underscore',
        'shared/PlayerCharacter'],
function (_,
          PlayerCharacter) {
  
  'use strict';
  
  var Player = {
    
    init: function (args) {
      args = args || {};
      
      this.uuid = args.uuid;
      if (args.character) this.character = args.character;
      this.entityId = this.character ? this.character.id : args.entityId;
      
      return this;
    },
    
    toJSON: function () {
      return {
        uuid: this.uuid,
        entityId: this.entityId
      };
    }
    
  };
  
  return Player;
});

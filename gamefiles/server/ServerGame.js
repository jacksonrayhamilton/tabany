define(['shared/Game', 'shared/inherits'],
function (Game, inherits) {
  
  var ServerGame = inherits(Game, {
    
    init: function (superInit, args) {
      var io, socket;
      
      args = args || {};
      this.io = args.io;
      this.socket = args.socket;
      
      superInit.call(this);
      
      return this;
    },
    
  });
  
  return ServerGame;
});

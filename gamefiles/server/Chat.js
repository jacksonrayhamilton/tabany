define(
function () {
  
  'use strict';
  
  /*
   * Maintains the state of the game's chat system, but was mostly bastardized
   * because it couldn't validate Players as well as ServerGame could.
   * 
   * However it will still probably do cool message validation things in
   * the future.
   */
  var Chat = {
    
    init: function (args) {
      args = args || {};
      
      this.nextMessageId = 1;
      
      return this;
    },
    
    getNextMessageId: function () {
      var ret = this.nextMessageId;
      this.nextMessageId += 1;
      return ret;
    },
    
    validateMessage: function (message) {
      return (message !== '');
    },
    
    // Censor curse-words, etc.
    censorMessage: function (message) {
      return message;
    }
  };
  
  return Chat;
});

define(
function () {
  
  var Chat = {
    
    init: function (args) {
      args = args || {};
      
      this.messageCount = 0;
      
      return this;
    },
    
    getNextMessageId: function () {
      var ret = this.messageCount;
      this.messageCount += 1;
      return ret;
    },
    
    validateMessage: function (message) {
      return (message !== '');
    },
    
    // Censor curse-words, etc.
    censorMessage: function () {
    }
  };
  
  return Chat;
});

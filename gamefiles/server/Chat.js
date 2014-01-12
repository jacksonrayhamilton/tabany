define(
function () {
  
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

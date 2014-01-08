define(
function () {
  
  'use strict';
  
  var Chat = {
    
    init: function (args) {
      args = args || {};
      
      this.socket = args.socket;
      this.hook = args.hook;
      
      this.socket.on('sendMessageToClient', function (data) {
        this.onSendMessageToClient(data);
        if (this.hook) {
          this.hook(data);
        }
      }.bind(this));
      
      return this;
    },
    
    sendMessageToServer: function (message) {
      this.socket.emit('sendMessageToServer', {
        // TODO: Other stuff might go here.
        message: message
      });
    },
    
    onSendMessageToClient: function (data) {
    }
  };
  
  return Chat;
});

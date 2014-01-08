define(
function () {
  
  var Chat = {
    
    init: function (args) {
      args = args || {};
      
      this.io = args.io;
      this.socket = args.socket;
      
      this.socket.on('sendMessageToServer', this.onSendMessageToServer.bind(this));
      
      return this;
    },
    
    sendMessageToClients: function (data) {
      this.io.sockets.emit('sendMessageToClient', data);
    },
    
    onSendMessageToServer: function (data) {
      if (data.message !== '') {
        this.sendMessageToClients(data);
      }
    }
  };
  
  return Chat;
});

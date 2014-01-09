define(['jquery', 'client/Chat'],
function ($, Chat) {
  
  'use strict';
  
  var Chatbox = {
    
    init: function (args) {
      args = args || {};
      
      this.chat = Object.create(Chat).init({
        socket: args.socket,
        hook: this.onSendMessageToClient.bind(this)
      });
      
      this.$el = args.$el || $(args.el);
      this.$messages = this.$el.find('.chatbox-messages');
      this.$messageInput = this.$el.find('.chatbox-message-input');
      this.$messageSend = this.$el.find('.chatbox-message-send');
      
      this.$el.on('click', this.onClick);
      this.$messageInput.on('keydown', this.onMessageInputKeydown.bind(this));
      this.$messageSend.on('click', this.onMessageSendClick.bind(this));
      
      return this;
    },
    
    // Determines if scrolled to the bottom of the messages element.
    isScrolledToBottom: function () {
      var scrollPosition = this.$messages.scrollTop() + this.$messages.innerHeight();
      var scrollHeight = this.$messages[0].scrollHeight;
      return (scrollPosition >= scrollHeight);
    },
    
    onSendMessageToClient: function (data) {
      var scrollLater, $messages;
      
      if (this.isScrolledToBottom()) {
        scrollLater = true;
      }
      
      $messages = this.$messages;
      $messages.append(data.message, '<br>');
      
      if (scrollLater) {
        $messages.scrollTop($messages[0].scrollHeight);
      }
    },
    
    onClick: function (event) {
      event.stopPropagation();
    },
    
    onMessageInputKeydown: function (event) {
      var keyCode = event.which;
      // The Enter key is a shortcut to click the Send button.
      if (keyCode === 13) {
        this.$messageSend.trigger('click');
      }
      event.stopPropagation();
    },
    
    onMessageSendClick: function (event) {
      var message = this.$messageInput.val();
      if (message !== '') {
        this.chat.sendMessageToServer(message);
        this.$messageInput.val('');
      }
    }
    
  };
  
  return Chatbox;
});

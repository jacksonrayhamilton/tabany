define(['jquery', 'moment', 'underscore'],
function ($, moment, _) {
  
  'use strict';
  
  var Chatbox = {
    
    chatMessageTemplate: _.template('<div class="chat-messsage"><a name="<%- id %>" title="#<%- id %> @ <%- time %>: <%- name %> (<%- identifier  %>)"><span class="chat-message-name" style="color: <%- color %>;"><%- name %>:</span></a> <%- message %></div>'),
    
    init: function (args) {
      args = args || {};
      
      this.sendMessage = args.sendMessage;
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
    
    addMessage: function (data) {
      var scrollLater, $messages;
      
      data.time = moment(data.time).format('hh:mm:ss A');
      
      if (this.isScrolledToBottom()) {
        scrollLater = true;
      }
      
      $messages = this.$messages;
      $messages.append(this.chatMessageTemplate(data));
      
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
        this.sendMessage(message);
        this.$messageInput.val('');
      }
    }
    
  };
  
  return Chatbox;
});

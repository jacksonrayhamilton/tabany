define(['jquery'],
function ($) {
  
  'use strict';
  
  /*
   * Handles client input for specified keyCodes using jQuery.
   */
  var Input = {
    
    init: function (keyArgs) {
      var keyCode, keyArg, $document;
      
      if (!keyArgs) throw new Error('Missing key arguments.');
      
      this.keydownCallbacks = {};
      this.keyupCallbacks = {};
      this.keyProperties = {};
      
      // Fill up the callbacks and properties containers with the
      // passed-in args.
      for (keyCode in keyArgs) {
        keyArg = keyArgs[keyCode];
        if (keyArg.keydown) {
          this.keydownCallbacks[keyCode] = keyArg.keydown;
        }
        if (keyArg.keyup) {
          this.keyupCallbacks[keyCode] = keyArg.keyup;
        }
        if (keyArg.properties) {
          this.keyProperties[keyCode] = keyArg.properties;
        }
      }
      
      this.pressedKeys = [];
      
      $document = $(document);
      $document.on('keydown', this.keydown.bind(this));
      $document.on('keyup', this.keyup.bind(this));
      
      return this;
    },
    
    keydown: function (event) {
      var keyCode = event.which;
      this.addKey(keyCode);
      if (this.keydownCallbacks[keyCode]) {
        this.keydownCallbacks[keyCode](event);
      }
    },
    
    keyup: function (event) {
      var keyCode = event.which;
      this.removeKey(keyCode);
      if (this.keyupCallbacks[keyCode]) {
        this.keyupCallbacks[keyCode](event);
      }
    },
    
    keyIsPressed: function (keyCode) {
      return (this.pressedKeys.indexOf(keyCode) > -1);
    },
    
    addKey: function (keyCode) {
      if (!this.keyIsPressed(keyCode)) {
        this.pressedKeys.push(keyCode);
      }
    },
    
    removeKey: function (keyCode) {
      var index = this.pressedKeys.indexOf(keyCode);
      if (index > -1) {
        this.pressedKeys.splice(index, 1);
      }
    }
    
  };
  
  return Input;
});

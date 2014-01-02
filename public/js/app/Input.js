define(['jquery'],
function ($) {
  
  var Input = {
    init: function (mappings) {
      var $document = $(document);
      this.mappings = mappings;
      this.keys = [];
      $document.on('keydown', this.keydown.bind(this));
      $document.on('keyup', this.keyup.bind(this));
    },
    keydown: function (event) {
      var keyCode = event.which;
      this.addKey(keyCode);
      if (this.mappings[keyCode]) {
        this.mappings[keyCode].call(this, event);
      }
    },
    keyup: function (event) {
      var keyCode = event.which;
      this.removeKey(keyCode);
    },
    keyIsPressed: function (keyCode) {
      return (this.keys.indexOf(keyCode) > -1);
    },
    addKey: function (keyCode) {
      if (!this.keyIsPressed(keyCode)) {
        this.keys.push(keyCode);
      }
    },
    removeKey: function (keyCode) {
      var index = this.keys.indexOf(keyCode);
      if (index > -1) {
        this.keys.splice(index, 1);
      }
    }
  };
  
  return Input;
});

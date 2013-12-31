define(['jquery'],
function ($) {
  
  var Input = {
    init: function (mappings) {
      this.mappings = mappings;
      $(document).on('keydown', this.receiveInput.bind(this));
    },
    receiveInput: function (event) {
      if (this.mappings[event.which]) {
        this.mappings[event.which].call();
      }
    }
  };
  
  return Input;
});

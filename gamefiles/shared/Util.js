define(
function () {
  
  'use strict';
  
  /*
   * Random useful little functions whose functionality should be abstracted.
   */
  var Util = {
    
    inBrowser: function () {
      return (typeof window !== 'undefined');
    },
    
    slice: (function () {
      var unboundSlice = Array.prototype.slice;
      return Function.prototype.call.bind(unboundSlice);
    }()),
    
  };
  
  return Util;
});

define(
function () {
  
  'use strict';
  
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

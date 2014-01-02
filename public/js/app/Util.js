define(
function () {
  
  var Util = {
    slice: (function () {
      var unboundSlice = Array.prototype.slice;
      return Function.prototype.call.bind(unboundSlice);
    }())
  };
  
  return Util;
});

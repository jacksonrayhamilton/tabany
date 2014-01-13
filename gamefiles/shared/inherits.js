/*
 * Wraps prototypal inheritance with an inherits() function
 * and super emulation.
 * 
 * Allows for an object-literal syntax that feels consistent with the
 * syntax for regular Object creation (but avoids Object.defineProperties()
 * so all properties can painlessly remain writable, configurable,
 * and enumerable).
 * 
 * Also adds super emulation through the first argument of child.init().
 * All children must define their initializers like so:
 * 
 * var Child = {
 *   init: function (applySuper, ... ) {
 *     // To invoke the parent constructor (passing `arguments` is optional):
 *     applySuper(this, arguments);
 *     ...
 *   }
 * }
 */
define(['underscore'],
function (_) {
  
  'use strict';
  
  // Creates a "child" object where its "parent" is its prototype. Also
  // partializes the child's initializer with a function for super emulation.
  var inherits = function (parent, properties) {
    
    var child = Object.create(parent);
    _.extend(child, properties);
    
    if (child.init) {
      child.init = _.partial(child.init, (function () {
        var parentInit = parent.init;
        // Optionally pass an arguments object as the second argument to
        // applySuper() to have it automatically sliced and applied to
        // the parent's initializer.
        return function (thisArg, initArguments) {
          initArguments = initArguments || {};
          parentInit.apply(thisArg, Array.prototype.slice.call(initArguments, 1));
        };
      }()));
    }
    
    return child;
  };
  
  return inherits;
});

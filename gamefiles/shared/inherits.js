/*
 * Wraps prototypal inheritance while permitting consistent
 * object-literal syntax for object creation, with ES3-style properties
 * (all writable, configurable, and enumerable).
 */
define(['underscore'],
function (_) {
  
  var inherits = function (parent, properties) {
    var child = Object.create(parent);
    _.extend(child, properties);
    return child;
  };
  
  return inherits;
});

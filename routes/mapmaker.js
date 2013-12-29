
/*
 * GET mapmaker page.
 */

var ejs = require('ejs');
var fs = require('fs')

// Source:
// http://phpjs.org/functions/ucwords/
var ucwords = (function() {
  var regex = /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g;
  return function(str) {
    return (str + '').replace(regex, function ($1) {
      return $1.toUpperCase();
    });
  };
}());

var createControl = (function() {
  var mapmakerControlTemplate = fs.readFileSync( 'views/templates/mapmaker_control.ejs', 'utf8');
  return function(action, filename) {
    var name = ucwords(action.replace('-', ' ', 'g'));
    return ejs.render(mapmakerControlTemplate, {
      action: action,
      filename: filename,
      name: name
    });
  };
}());

exports.index = function(req, res){
  res.render('mapmaker', {
    title: 'Tabany\'s Map Creation Utility, Map Maker | Tabany',
    stylesheets: ['global', 'map', 'mapmaker'],
    javascripts: ['polyfills', 'inheritance', 'map', 'mapmaker'],
    createControl: createControl
  });
};

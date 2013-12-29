var ejs = require('ejs');
var fs = require('fs')

// Source:
// http://phpjs.org/functions/ucwords/
var ucwords = (function () {
  var regex = /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g;
  return function (str) {
    return (str + '').replace(regex, function ($1) {
      return $1.toUpperCase();
    });
  };
}());

// A view helper. Creates a mapmaker control (button) element for a
// certain action and with a certain icon.
// e.g.: createControl('new-map', 'page_white') creates a button for
// making new maps that uses a white page icon.
var createControl = (function () {
  var mapmakerControlTemplate = fs.readFileSync('views/templates/mapmaker_control.ejs', 'utf8');
  return function (action, filename) {
    var name = ucwords(action.replace('-', ' ', 'g'));
    return ejs.render(mapmakerControlTemplate, {
      action: action,
      filename: filename,
      name: name
    });
  };
}());


/*
 * GET the Map Maker main page.
 */

exports.index = function (req, res) {
  res.render('mapmaker', {
    title: 'Tabany\'s Map Creation Utility, Map Maker | Tabany',
    stylesheets: ['global', 'map', 'mapmaker'],
    javascripts: ['polyfills', 'inheritance', 'map', 'mapmaker'],
    createControl: createControl
  });
};


/*
 * POST json maps and tilesets to write to disk.
 */

// CONSIDER: Export directly to maps/ directory? Allow flags to turn off
// timestamping?
exports.write = (function () {
  
  var mapsPath = 'public/maps/exported/',
      tilesetsPath = 'public/tilesets/exported/',
      ext = '.json',
      
      // Generate a filename that is prefixed and contains its creation time
      generateName = (function () {
        var regex = /[\s:]/g;
        return function (prefix) {
          var date = new Date().toString().substring(4, 24).toLowerCase().replace(regex, function () {
            return '-';
          });
          return prefix + '-' + date;
        };
      }()); 
  
  return function (req, res) {
    var param, data, type, path, name, filename;
    
    // Handle multiple types of incoming json objects
    if (typeof req.body.map !== 'undefined') {
      param = req.body.map;
      data = JSON.parse(param);
      path = mapsPath;
    } else if (typeof req.body.tileset !== 'undefined') {
      param = req.body.tileset;
      data = JSON.parse(param);
      path = tilesetsPath;
    }
    
    if (data.name === null) {
      name = 'untitled';
    } else {
      name = data.name;
    }
    
    // Generate a time-stamped name for the file
    filename = generateName(name) + ext;
    
    fs.writeFile(path + filename, param, function (err) {
      if (err) {
        res.send('Failed to write file!');
        throw err;
      }
      res.send('Wrote file "' + filename + '" to "' + path + '".');
    });
    
    console.log(type, path, name, filename);
  };
}());



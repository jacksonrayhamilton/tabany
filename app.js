
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var play = require('./routes/play');
var mapmaker = require('./routes/mapmaker');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// Load the express-partials middleware
// This enables view layouts
// Must be placed before `app.use(app.router);`
var partials = require('express-partials');
app.use(partials());

// Process HTTP POST requests
app.use(express.urlencoded());
app.use(express.json());

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('*&DRn9$CjzEr7z7hbw3PdT9ph4z&2qVNg'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/play', play.index);
app.get('/mapmaker', mapmaker.index);
app.post('/mapmaker/write', mapmaker.write);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

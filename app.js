
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var testing = require('./routes/testing');
var http = require('http');
var path = require('path');

var app = express();

// Enable view layouts. Must be placed before `app.use(app.router)`.
var partials = require('express-partials');
app.use(partials());

// Process HTTP POST requests.
app.use(express.urlencoded());
app.use(express.json());

// All environments
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

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/testing', testing.index);

var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

// TODO: Consider better alternatives to this pattern.
var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require,
    baseUrl: './server/js/lib',
    paths: {
      app: '../app'
    }
});
requirejs(['app/main'], function (main) {
  main(server);
});

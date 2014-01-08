

/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');
var connect = require('connect');
var less = require('less-middleware');
var serverStart = require('./gamefiles/server/server_start.js');


/**
 * Application initialization.
 */

var app = connect();
app.use(connect.favicon(path.join(__dirname, 'images/favicon.ico')));
app.use(connect.logger('dev'));

// Allow HTTP POST requests.
app.use(connect.json());
app.use(connect.urlencoded());

// Use sessions.
// Remember to use different secrets in production.
app.use(connect.cookieParser('*&DRn9$CjzEr7z7hbw3PdT9ph4z&2qVNg'));
app.use(connect.session({
  secret: 'Xh2NMK!JhJfh$*3YnHMwR2zAE%hBf524CNm',
  key: 'sid',
  cookie: {
    secure: true
  }
}));

// Automatically compile less files to css.
app.use(less({
  src: __dirname,
  compress: true
}));

// Website's regular static directory.
app.use(connect.static('public'));

// Client, server and shared game files directory.
app.use('/gamefiles', connect.static(path.join(__dirname, 'gamefiles')));

// Display the game's source code in a friendly manner.
app.use('/gamefiles', connect.directory(path.join(__dirname, 'gamefiles'), {
  icons: true
}));

// Start an HTTP server.
var httpServer = http.createServer(app);
var PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function () {
  console.log('Tabany server listening on port ' + PORT);
});

// Send the HTTP server to the game server (so it can create a socket).
serverStart(httpServer);

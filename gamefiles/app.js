
/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');
var connect = require('connect');
var secrets = require('../secrets.json');
var server = require('./server/server.js');


/**
 * Application initialization.
 */

var app = connect();
app.use(connect.favicon(path.join(__dirname, '../public/images/favicon.ico')));
app.use(connect.logger('dev'));
app.use(connect.json());
app.use(connect.urlencoded());

// Enable sessions.
// (Remember to change your secrets from the defaults.)
app.use(connect.cookieParser(secrets.cookie));
app.use(connect.session({
  secret: secrets.session,
  key: 'sid',
  cookie: {
    secure: true
  }
}));

// Set website's regular static directory.
app.use(connect.static('public'));

// Set client, server and shared game files directory.
app.use('/gamefiles', connect.static(path.join(__dirname, '../gamefiles')));

// Display the game's source code directory in a friendly manner.
app.use('/gamefiles', connect.directory(path.join(__dirname, '../gamefiles'), {
  icons: true
}));

// Start an HTTP server.
var httpServer = http.createServer(app);
var PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function () {
  console.log('Tabany server listening on port ' + PORT);
});

// Send the HTTP server to the game server (so it can create a socket).
server(httpServer);

'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// configuration
try {
  var configJSON = fs.readFileSync(__dirname + "/config.json");
  var config = JSON.parse(configJSON.toString());
} catch (e) {
  console.error("File config.json not found or is invalid: " + e.message);
  process.exit(1);
}
routes.init(config);

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('EGT95tvRan4bAFvOZvmbgK3s8VOFZlcJ5m7ZvYVUhuTSg1FqgUuDoUYpxO1-BIHjxdOSPSWGU2zUgHfT'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'media')));
app.use('/media', express.static(__dirname + '/media'));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.draft);
app.get('/sketch', routes.index);
app.post('/create', routes.create);
app.get('/admin42', routes.admin); //TODO(sujay): Tmp security measure.
app.post('/paypal', routes.paypal);
app.get('/success', routes.success);
app.get('/cancel', routes.cancel);
app.post('/execute', routes.execute);
app.post('/suggestion', routes.suggestion);
app.get('/suggestions', routes.suggestions);
app.get('/mission', routes.draft);
app.get('/nibbles', routes.nibbles);
app.post('/validatereferral', routes.validatereferral);
app.get('/volunteer', routes.volunteer);


http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

'use strict';

var config = require('./config'),
	express = require('express'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	mongoStore = require('connect-mongo')(session),
	http = require('http'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path');

// create express app
var app = module.exports = express();

// keep reference to config
app.config = config;

// setup web server
app.server = http.createServer(app);

// setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
	console.log("mongoose ready :)");
});

// configure data models
require('./models')(app);

// settings
app.disable('x-powered-by');
app.set('port', config.port);

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser(config.cryptoKey));
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: config.cryptoKey,
	store: new mongoStore({ url: config.mongodb.uri })
}));

// setup routes
require('./routes')(app);

app.server.listen(app.config.port, function () {
	console.log("App listening on port " + config.port);
});
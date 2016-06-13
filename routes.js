'use strict';

var game = require('./service/game');

function useAngular (req, res, next) {
	res.sendFile(require('path').join(__dirname, './public/index.html'));
};

exports = module.exports = function (app) {

	app.get('/api/game-session', game.getSession);

	app.get('/', useAngular);

	app.all(/^(?!\/api).*$/, useAngular);
};
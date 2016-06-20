'use strict';

var game = require('./service/game');

function useAngular (req, res, next) {
	res.sendFile(require('path').join(__dirname, './public/index.html'));
};

exports = module.exports = function (app) {

	app.get('/api/game-session', game.getSession);
	app.get('/api/query-position', game.queryPosition);
	app.post('/api/select-response', game.selectResponse);
	app.post('/api/submit-response', game.submitResponse);

	// Development
	app.get('/api/reset', game.reset);
	app.get('/api/print', game.print);
	app.post('/api/restart', game.restart);

	app.get('/', useAngular);

	app.all(/^(?!\/api).*$/, useAngular);
};
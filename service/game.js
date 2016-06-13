'use strict';

function initialize(req) {
	var gameData = req.session.gameData;
	if (!gameData) {
		gameData = req.session.gameData = {
			round: 0,
			interaction: 0
		};
	}
};

var game = {

	getSession: function(req, res, next) {
		initialize(req);
		res.status(200).json(req.session);
	}
};

module.exports = game;
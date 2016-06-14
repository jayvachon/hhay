'use strict';

var interactionCount = 4,
	exchangeCount = 1;

function randomArrayValue(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function createDefaultInteraction() {

	var intros = [
		"Hi, how are you?",
		"Hey, how are you?",
		"Hey, how's it going?",
		"How you doing?",
		"Hi, how are you today?"
	];

	var responses = [
		"Good, you?",
		"I'm good, how are you?",
		"Good, and you?",
		"Pretty good, how 'bout you?",
		"Doing good. Yourself?"
	];

	var reactions = [
		"Good, thanks.",
		"Fine, thanks",
		"Can't complain.",
		"Doing well.",
		"I'm good.",
		"Good.",
		"I'm good. Thanks for asking."
	];

	return {
		exchanges: [
			{
				text: randomArrayValue(intros),
				'options': [
					{ text: randomArrayValue(responses) }
				]
			},
			{
				text: randomArrayValue(reactions),
				'options': [
					{ text: 'Begin conversation' }
				]
			}
		]
	}
}

function applyResponseOptions(req, interaction, cb) {
	req.app.db.models.Response.find({ 'round': req.session.gameData.roundIdx }).exec(function(err, responses) {

		if (err) return cb(err);

		interaction.exchanges[0].options.push(responses[0]);
		cb();
	});
}

function generateInteraction(req, gameData, cb) {
	gameData.interaction = createDefaultInteraction();
	if (gameData.roundIdx > 0) {
		applyResponseOptions(req, gameData.interaction, function(err) {
			if (err) return console.log(err);
			cb();
		});
	} else {
		cb();
	}
}

function getSessionData(req, cb) {

	// Generate game data to start the round

	var gameData = req.session.gameData;

	if (!gameData) {

		// Initialize the data if none exists
		gameData = req.session.gameData = {
			roundIdx: 0,
			interactionIdx: 0,
			exchangeIdx: 0
		};
	}

	generateInteraction(req, gameData, cb);
}

function iterate(req, cb) {

	var gameData = req.session.gameData;

	if (gameData.exchangeIdx < exchangeCount) {

		// Iterate the exchange if we have not reached the end of the conversation
		gameData.exchangeIdx ++;
		cb();
	} else if (gameData.interactionIdx < interactionCount) {

		// Iterate the interaction if we have not reached the end of the round
		gameData.interactionIdx ++;
		gameData.exchangeIdx = 0;
		generateInteraction(req, gameData, cb);

	} else {

		// Iterate the round if all interactions are done
		gameData.roundIdx ++;
		gameData.interactionIdx = 0;
		gameData.exchangeIdx = 0;
		cb();
	}
}

function addResponse(req, cb) {
	req.app.db.models.Response.create({
		text: req.body.response,
		round: req.session.gameData.roundIdx
	}, function(err, response) {
		if (err)
			return res.status(400).json({ 'error': err });
		cb(response);
	});
}

var game = {

	getSession: function(req, res, next) {
		getSessionData(req, function() {
			res.status(200).json(req.session);
		});
	},

	selectResponse: function(req, res, next) {
		iterate(req, function() {
			res.status(200).json(req.session);
		});
	},

	submitResponse: function(req, res, next) {
		addResponse(req, function(response) {
			res.status(200).json(response);
		});
	},

	reset: function(req, res, next) {
		req.session.destroy(function(err) {
			req.app.db.models.Response.remove({}, function(err) {
				if (err)
					return console.log(err);
				res.status(200).json({ status: 'success' });
			});
		});
	}
};

module.exports = game;
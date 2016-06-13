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
	],

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
					{
						response: randomArrayValue(responses)
					}
				]
			},
			{
				text: randomArrayValue(reactions),
				'options': [
					{
						response: 'Begin conversation'
					}
				]
			}
		]
	}
}

function getSessionData(req) {

	var gameData = req.session.gameData;

	if (!gameData) {

		// Initialize the data if none exists
		gameData = req.session.gameData = {
			roundIdx: 0,
			interactionIdx: 0,
			exchangeIdx: 0
		};

		gameData.interaction = createDefaultInteraction();

	} else {

		if (gameData.exchangeIdx < exchangeCount) {

			// Iterate the exchange if we have not reached the end of the conversation
			gameData.exchangeIdx ++;
		} else if (gameData.interactionIdx < interactionCount) {

			// Iterate the interaction if we have not reached the end of the round
			gameData.interactionIdx ++;
			gameData.exchangeIdx = 0;

			if (gameData.roundIdx === 0) {
				gameData.interaction = createDefaultInteraction();
			}

		} else {

			// Iterate the round if all interactions are done
			gameData.roundIdx ++;
			gameData.interactionIdx = 0;
			gameData.exchangeIdx = 0;
		}
	}
};

var game = {

	getSession: function(req, res, next) {
		getSessionData(req);
		res.status(200).json(req.session);
	},

	reset: function(req, res, next) {
		req.session.destroy(function(err) {
			res.status(200).json({ status: 'success' });
		});
	}
};

module.exports = game;
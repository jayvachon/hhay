'use strict';

exports = module.exports = function (app, mongoose) {

	var responseSchema = new mongoose.Schema({
		text: String,
		round: Number,
		clickCount: { type: Number, default: 0 },
		dateCreated: { type: Date, default: Date.now }
	});
	app.db.model('Response', responseSchema);
};
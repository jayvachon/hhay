'use strict';

exports = module.exports = function (app, mongoose) {
	require('./models/Response')(app, mongoose);
};
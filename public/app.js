'use strict';

function randomArrayValue(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

var app = angular.module('hhay', [
	'ngRoute',
	'cloudinary'
]);

app.config(['$routeProvider', '$httpProvider', '$locationProvider', function ($routeProvider, $httpProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			templateUrl: 'views/main.html'
		})
		.when('/game', {
			templateUrl: 'views/game.html',
			controller: 'GameController',
			controllerAs: 'gameCtrl'
		})
		.when('/userResponse', {
			templateUrl: 'views/userResponse.html',
			controller: 'ResponseController',
			controllerAs: 'responseCtrl'
		})
		.when('/end', {
			templateUrl: 'views/end.html'
		})
		.when('/404', {
			templateUrl: 'views/404.html'
		})
		.otherwise({ redirect: '/404' })
}]);

app.controller('GameController', ['$scope', '$http', '$location', 'cloudinary', function($scope, $http, $location, cloudinary) {

	var ctrl = this;

	this.applyData = function(data) {
		var gameData = data.gameData;
		var exchange = gameData.interaction.exchanges[gameData.exchangeIdx];
		$scope.data = gameData;
		$scope.exchange = exchange.text;
		$scope.options = exchange.options;
		$scope.imgURL = "https://res.cloudinary.com/appleslerp/image/upload/hhay/" + gameData.interaction.character + ".jpg";
	}

	$http.get('/api/game-session')
		.success(function(data) {
			ctrl.applyData(data);
		})
		.error(function(err) {
			console.log('error: ' + err);
		});

	this.selectResponse = function(option) {
		$http.post('/api/select-response', option)
			.success(function(data) {
				
				// If this is the beginning of the round, get the user's response
				if (data.gameData.interactionIdx === 0 && data.gameData.exchangeIdx === 0) {
					$location.path('/userResponse');
				} else {
					ctrl.applyData(data);
				}
			})
			.error(function(err) {
				console.log('error: ' + err);
			});
	}

	this.restart = function() {
		$http.post('/api/restart')
			.success(function(data) {
				$http.get('/api/game-session')
					.success(function(data) {
						$location.path('/end');
					})
					.error(function(err) {
						console.log('error: ' + err);
					});
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	}
}]);

app.controller('ResponseController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	var ctrl = this;

	$http.get('/api/query-position')
		.success(function(data) {

			// Redirect if the player has not completed the round yet (prevent people from skipping to this part by editing the url)
			var gameData = data.gameData;
			if (!gameData || gameData.roundIdx === 0 || gameData.interactionIdx > 0 || gameData.exchangeIdx > 0)
				$location.path('/game');
		})
		.error(function(err) {
			console.log(err);
		});

	this.submitResponse = function() {

		$http.post('/api/submit-response', ctrl)
			.success(function(data) {
				$location.path('/game');
			})
			.error(function(err) {
				console.log('error: ' + err);
			});
	}
}]);

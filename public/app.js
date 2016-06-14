(function() {

	'use strict';

	var app = angular.module('hhay', [
		'ngRoute'
	]);

	app.config(['$routeProvider', '$httpProvider', '$locationProvider', function ($routeProvider, $httpProvider, $locationProvider) {
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
			.when('/404', {
				templateUrl: 'views/404.html'
			})
			.otherwise({ redirect: '/404' })
	}]);

	app.controller('GameController', ['$scope', '$http', '$location', function($scope, $http, $location) {

		var ctrl = this;

		this.applyData = function(data) {
			var gameData = data.gameData;
			var exchange = gameData.interaction.exchanges[gameData.exchangeIdx];
			$scope.data = gameData;
			$scope.exchange = exchange.text;
			$scope.options = exchange.options;
		}

		$http.get('/api/game-session')
			.success(function(data) {
				ctrl.applyData(data);
			})
			.error(function(err) {
				console.log('error: ' + err);
			});

		this.selectResponse = function() {
			$http.get('/api/select-response')
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
	}]);

	app.controller('ResponseController', ['$scope', '$http', '$location', function($scope, $http, $location) {

		var userResponseForm = this;

		this.submitResponse = function() {

			$http.post('/api/submit-response', userResponseForm)
				.success(function(data) {
					$location.path('/game');
				})
				.error(function(err) {
					console.log('error: ' + err);
				});
		}
	}]);
})();
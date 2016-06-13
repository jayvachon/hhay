(function() {

	'use strict';

	var app = angular.module('salkr', [
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
			.when('/404', {
				templateUrl: 'views/404.html'
			})
			.otherwise({ redirect: '/404' })
	}]);

	app.controller('GameController', ['$scope', '$http', function($scope, $http) {
		$http.get('/api/game-session')
			.success(function(data) {
				var gameData = data.gameData;
				var exchange = gameData.interaction.exchanges[gameData.exchangeIdx];
				$scope.data = gameData;
				$scope.exchange = exchange.text;
				$scope.options = exchange.options;
			})
			.error(function(err) {
				console.log('error: ' + err);
			});
	}]);

})();
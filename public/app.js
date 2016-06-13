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

	app.controller('GameController', ['$http', function($http) {
		$http.get('/api/game-session')
			.success(function(data) {
				console.log("GOT IT");
				console.log(data);
			})
			.error(function(err) {
				console.log('error: ' + err);
			});
	}]);

})();
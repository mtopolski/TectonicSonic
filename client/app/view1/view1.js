'use strict';

angular.module('app.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'Users', 'Cards', function($scope, Users, Cards) {
	$scope.user = "UserCard";
	var players = [];
	for (var i = 0; i < 5; i++) {
		players.push(Users.addUser());
	};
	// console.log(players);
	var player = Users.addUser();

	var deckCards = Cards.shuffleBySwap();
	console.log(deckCards);
	// Add cards
	// $scope.MyCard = Cards.valueSuitFromCard(1);;
	$scope.MyCard = Cards.imageFromValueSuit("j", "h");

}])
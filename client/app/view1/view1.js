'use strict';

angular.module('app.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'Users', 'Cards', 'GameEmulator', function($scope, Users, Cards, GameEmulator) {
	$scope.user = "UserCard";
	var players = [];
	for (var i = 0; i < 5; i++) {
		players.push(Users.addUser());
	};

	var player = Users.addUser();
	var deckCards = Cards.shuffleBySwap();
	// var deckCards = Cards.allCards.slice(1);
	var deckCardsImg = [];
	// $scope.MyCard = Cards.valueSuitFromCard(1);;
	for (var i = 0, l = deckCards.length; i < l; i++) {
		deckCardsImg[i] = Cards.imageFromValueSuit(deckCards[i][0], deckCards[i][1]);
	};

	$scope.deckCardsImg = deckCardsImg;
	// console.log(deckCardsImg);
	// console.log(deckCardsImg.length);
	// $scope.deckCardsImg = deckCardsImg;
	$scope.MyCard = Cards.imageFromValueSuit("j", "h");
	// console.log($scope.MyCard);

}])
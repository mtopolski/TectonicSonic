'use strict';

angular.module('app.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'Users', 'Cards', 'GameEmulator', function($scope, Users, Cards, GameEmulator) {
	var players = [];
	for (var i = 0; i < 5; i++) {
		players.push(Users.addUser());
	};

	var mySelf = Users.addUser();
	var deckCards = Cards.shuffleBySwap();

	// $scope.deckCards
	if (deckCards.length) {
		$scope.cardBack = Cards.imageCardBack();
	};

	mySelf.cards.push(deckCards.pop());
	mySelf.cards.push(deckCards.pop());

	var publicCards = [];
	publicCards.push(deckCards.pop());
	publicCards.push(deckCards.pop());
	publicCards.push(deckCards.pop());
	// Two more rounds
	publicCards.push(deckCards.pop());
	publicCards.push(deckCards.pop());

	// OtherPlayers cards
	for (var i = 0; i < 5; i++) {
		players[i].cards.push(deckCards.pop());
		players[i].cards.push(deckCards.pop());
		players[i].cardsImg.push(Cards.imageCardBack());
	};

	$scope.players = players;
	$scope.publicCardsImg = Cards.renderCards(publicCards);

	// console.log("player status: ",  player);
	mySelf.cards = Cards.renderCards(mySelf.cards);
	$scope.mySelf = mySelf;	

	// fold 
	// check
	// leave

}])
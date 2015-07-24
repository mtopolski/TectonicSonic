'use strict';

angular.module('app.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'ViewCtrl'
  });
}])

.controller('ViewCtrl', ['$scope', 'Cards', 'wsComm', 'httpRequest', 'gameStateEmu',
	function($scope, Cards, wsComm, httpRequest, gameStateEmu) {
	///////////////////////////////////////////////
	var deckCards = Cards.shuffleBySwap();
	if (deckCards.length) {
		$scope.cardBack = Cards.imageCardBack();
	};

	var publicCards = [];
	publicCards.push(deckCards.pop());
	publicCards.push(deckCards.pop());
	publicCards.push(deckCards.pop());
	// Two more rounds
	publicCards.push(deckCards.pop());
	publicCards.push(deckCards.pop());

	// OtherPlayers cards
	// for (var i = 0; i < 5; i++) {
	// 	players[i].cards.push(deckCards.pop());
	// 	players[i].cards.push(deckCards.pop());
	// 	players[i].cardsImg.push(Cards.imageCardBack());
	// };

	// $scope.players = players;
	$scope.publicCardsImg = Cards.renderCards(publicCards);
	///////////////////////////////////////////////
	// Global vars
	// wsComm.wsSend(JSON.stringify("Check"));
	var gameState;

	///////////////////////////////////////////////	
	var init = function() {
		$scope.mySelf = {
			myName: "",
			uid: undefined
			// uid: undefined || 27694
		};
		$scope.gameState;

		wsComm.wsInit();

		$scope.inputUsername = function() {
			var myName = $scope.mySelf.myName;
			console.log("myUsername:", myName);
			// httpRequest.identity(myName).then(function(dataResponse, status, headers, config) {
			// 		$scope.mySelf.uid	= dataResponse.data;  
			// });
			
			// received assign uid from identity request resp
			if (myName === "27694") {
				$scope.mySelf.uid = 27694;	
				console.log("mySelf", $scope.mySelf);
			};
		};

		$scope.sitBtn = function() {
			var myUid = $scope.mySelf.uid;
			// httpRequest.sit(myUid, seatId).then(function(dataResponse, status, headers, config) {
				
			// };
		};

		$scope.standBtn = function() {
			var myUid = $scope.mySelf.uid;
			// httpRequest.stand(myUid).then(function(dataResponse, status, headers, config) {
				
			// };
		};

		$scope.checkBtn = function() {
			var myUid = $scope.mySelf.uid;
			// httpRequest.check(myUid).then(function(dataResponse, status, headers, config) {
				
			// };
		};

		$scope.foldBtn = function() {
			var myUid = $scope.mySelf.uid;
			// httpRequest.fold(myUid).then(function(dataResponse, status, headers, config) {
				
			// };
		};

		// input how much
		$scope.betBtn = function() {
			var myUid = $scope.mySelf.uid;
			// httpRequest.bet(myUid).then(function(dataResponse, status, headers, config) {
				
			// };
		};

		$scope.callBtn = function() {
			var myUid = $scope.mySelf.uid;
			// httpRequest.call(myUid).then(function(dataResponse, status, headers, config) {
				
			// };
		};

	}

	// expect input array of users
	// TODO: refactor name to renderUsers later
	var renderPlayers = function(userGroup, mySelf) {
		var players = [];
		for (var i = 0; i < userGroup.length; i++) {
			if (userGroup[i].uid === mySelf.uid) {
					$scope.mySelf = userGroup[i];
					console.log("Find Myself Data", $scope.mySelf.hand);
					// renderMySelf
					$scope.mySelf.cardsView = Cards.renderCards($scope.mySelf.hand);
					continue;
			};
			
			// render other users
			players[i] = userGroup[i];	
			players[i].cardsImg = [];
			if (userGroup[i].uid !== null) {
				players[i].cardsImg.push(Cards.imageCardBack());
			}
		};
		$scope.players = players;
	}

	// check updated gameState received from WebSocket
	var gameStateProc = function (gameState) {
		// required for dynamically change scope
		$scope.$apply(function() {
			$scope.gameState = JSON.parse(gameStateEmu.gameStateJSON[0]); 				// Test only
		});
		renderPlayers($scope.gameState.user, $scope.mySelf);
	};

	init();
	wsComm.wsUpdate(gameStateProc);
}])
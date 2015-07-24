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
	// wsComm.wsSend(JSON.stringify("Check"));	
	var init = function() {
		$scope.deckCard = Cards.imageCardBack();
		$scope.publicCardsImg = [];
		$scope.users = [];
		$scope.mySelf = {
			myName: "",
			uid: undefined
			// uid: undefined || 27694
		};
		$scope.gameState;

		wsComm.wsInit();

		$scope.inputUsername = function() {
			var myName = $scope.mySelf.myName;
			// console.log("myUsername:", myName);
			// httpRequest.identity(myName).then(function(dataResponse, status, headers, config) {
			// 		$scope.mySelf.uid	= dataResponse.data;  
			// });
			
			// received assign uid from identity request resp
			if (myName === "27694") {
				$scope.mySelf.uid = 27694;	
				// console.log("mySelf", $scope.mySelf);
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
	var renderUsers = function(userGroup, mySelf) {
		var users = [];
		for (var i = 0; i < userGroup.length; i++) {
			if (userGroup[i].uid === mySelf.uid) {
					$scope.mySelf = userGroup[i];
					// console.log("Find Myself Data", $scope.mySelf.hand);
					// renderMySelf
					$scope.mySelf.cardsView = Cards.renderCards($scope.mySelf.hand);
					continue;
			};
			
			// render other users
			users[i] = userGroup[i];	
			users[i].cardsImg = [];
			if (userGroup[i].uid !== null) {
				// user name and stats
				users[i].cardsImg.push(Cards.imageCardBack());
			}
		};
		$scope.users = users;
	};


	var renderPublicDeck = function(publicCards) {
		$scope.publicCardsImg = Cards.renderCards(publicCards);
	};

	// check updated gameState received from WebSocket
	// Game flow chart
	var gameStateProc = function (gameState) {
		// required for dynamically change scope
		$scope.$apply(function() {
			$scope.gameState = JSON.parse(gameStateEmu.gameStateJSON[0]); 				// Test only
		});
		renderUsers($scope.gameState.user, $scope.mySelf);
		// check game status before putting cards on table?
		renderPublicDeck($scope.gameState.cards)
	};

	init();
	wsComm.wsUpdate(gameStateProc);
}])
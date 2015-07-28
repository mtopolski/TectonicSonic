 'use strict';

angular.module('app.view1', ['ngRoute', 'btford.socket-io'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'ViewCtrl',
  });
}])

.controller('ViewCtrl', ['$scope', 'Cards', 'wsComm', 'httpRequest', 'gameStateEmu',
	function($scope, Cards, wsComm, httpRequest, gameStateEmu) {
	// wsComm.wsSend(JSON.stringify("Check"));	
	var init = function() {
		// socket.forward('gameStateUpdate', $scope);
		$scope.gameState;
		$scope.$on('socket:gameStateUpdate', function (ev, data) {
      $scope.gameState = data;
    })
		$scope.deckCard = Cards.imageCardBack();
		$scope.publicCardsImg = [];
		$scope.users = [];
		$scope.myStake = null;
		$scope.mySelf = {
			myName: "",
			uid: undefined,
			// uid: undefined || 27694
			inGame: false
		};

		$scope.gameState;

		wsComm.wsInit();

		$scope.inputUsername = function() {
			var myName = $scope.mySelf.myName;
			// $scope.blarble = myName;
			// console.log("myUsername:", myName);
			httpRequest.identify(myName).then(function(dataResponse, status, headers, config) {
					$scope.mySelf.uid	= dataResponse.data;  
			});
			
			// received assign uid from identity request resp
			// sim only
			// if (myName === "27694") {
			// 	$scope.mySelf.uid = 27694;	
			// 	// console.log("mySelf", $scope.mySelf);
			// } else {
			// 	$scope.mySelf.uid = 27695;
			// }
		};

		$scope.sitBtn = function() {
			var myUid = $scope.mySelf.uid;
			var seatId = checkSeats($scope.gameState.table);
			httpRequest.sit(myUid, seatId).then(function(dataResponse, status, headers, config) {
				console.log($scope.mySelf.uid);
			});

			// sim only
			if (myUid === 27695) {
				$scope.mySelf.uid = 27694;
			};
		};

		$scope.standBtn = function() {
			var myUid = $scope.mySelf.uid;
			httpRequest.stand(myUid).then(function(dataResponse, status, headers, config) {
				
			});
		};

		$scope.checkBtn = function() {
			var myUid = $scope.mySelf.uid;
			httpRequest.check(myUid).then(function(dataResponse, status, headers, config) {
				
			});
		};

		$scope.foldBtn = function() {
			var myUid = $scope.mySelf.uid;
			httpRequest.fold(myUid).then(function(dataResponse, status, headers, config) {
				
			});
		};

		// input how much
		$scope.betBtn = function() {
			var myUid = $scope.mySelf.uid;
			var myStake = $scope.myStake;
			// if (myStake < $scope.gameState.minstake) {
			// 	myStake = $scope.myStake = $scope.gameState.minstake;
			// } 

			// if (myStake > $scope.mySelf.money) {
			// 	// exception: I don't have enough money left!
			// 	myStake = $scope.myStake = null;
			// 	console.error("No money!");
			// }
			// console.log("myStake ", myStake);
			httpRequest.bet(myUid, myStake).then(function(dataResponse, status, headers, config) {
				
			});
		};

		$scope.callBtn = function() {
			var myUid = $scope.mySelf.uid;
			httpRequest.call(myUid).then(function(dataResponse, status, headers, config) {
				
			});
		};

	}

	// Determine which seat(s) is/are empty, then place the user to first avaiable seat
	var checkSeats = function(table) {
		for (var seat = 0, l = table.length; seat < l; seat++) {
			if (table[seat] === null) {
				return seat;
			};
		};
		return null;
	};

	// expect input array of users
	var renderUsers = function(userGroup, mySelf) {
		var users = [];
		var gameState = $scope.gameState;
		for (var i = 0, l = userGroup.length; i < l; i++) {
			console.log(userGroup[i].uid);
			userGroup[i].inGame = true;
			console.log(mySelf.uid);
			if (userGroup[i].uid == mySelf.uid) {
					$scope.mySelf = userGroup[i];
					$scope.mySelf.cardsView = Cards.renderCards($scope.mySelf.hand);
				if ($scope.gameState.turn == mySelf.uid) {
						// render mySelf
						$scope.mySelf.inGame = true;
						console.log($scope.mySelf, 'what is happening');
						// continue;
				}
			}
			
			// render other users
			users[i] = userGroup[i];	
			users[i].cardsImg = [];

			if (userGroup[i].uid !== null && gameState.round > 0 && gameState.round < 5) {
				// users[i].cardsImg.push(Cards.imageCardBack());
				users[i].cardsImg[0] = Cards.imageCardBack();
				users[i].cardsImg[1] = Cards.imageCardBack();
			}

			if (userGroup[i].uid !== null && gameState.round === 5) {
				// users[i].cardsImg.push(Cards.imageCardBack());
				users[i].cardsImg = Cards.renderCards(users[i].hand);
			}			
		};
		$scope.users = users;
	};

	// show only the deck during round 0
	var checkRound = function(gameState) {
		var publicCards = [];
		if(gameState.round === 0) {
			document.getElementById("publicDeck").style.visibility = "hidden";
			document.getElementById("mySelfDeck").style.visibility = "hidden";
		} else {
			document.getElementById("mySelfDeck").style.visibility = "visible";
			document.getElementById("publicDeck").style.visibility = "visible";
		}

		// display community cards based on round
		var endSlice = 0;
		if(gameState.round === 2) {
			endSlice = 3;
		}

		else if(gameState.round === 3) {
			endSlice = 4;
		}

		else if(gameState.round === 4 || gameState.round === 5) {
			endSlice = 5;
		}

		publicCards = gameState.cards.slice(0, endSlice);
		return publicCards;
  };



	var renderPublicDeck = function(publicCards) {
		$scope.publicCardsImg = Cards.renderCards(publicCards);
	};

	// check updated gameState received from WebSocket
	// Game flow chart
	var gameStateProc = function (gameState) {
		// required for dynamically change scope
		$scope.$apply(function() {
			// $scope.gameState = JSON.parse(gameStateEmu.gameStateJSON[0]); 				// Test only
			$scope.gameState = gameState;
			console.log(gameState);
			renderUsers($scope.gameState.users, $scope.mySelf);
			var cards = checkRound($scope.gameState);
			// check game status before putting cards on table?
			renderPublicDeck(cards);
		});
	};

	init();
	wsComm.wsUpdate(gameStateProc);

}])

// .factory('socket', function (socketFactory) {
//   return socketFactory({
//     ioSocket: io.connect('/some/path')
//   });
// })
'use strict'

angular.module('app.service', [])
.factory('ViewService', [function() {

}])
.factory('Cards', function() {
	var allCards = ['', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'th', 'jh', 'qh', 'kh', 'ah'
                     , '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'td', 'jd', 'qd', 'kd', 'ad'
                     , '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'tc', 'jc', 'qc', 'kc', 'ac'
                     , '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'ts', 'js', 'qs', 'ks', 'as'
                   ];
	var SUIT = {
    	'h': -1,
    	'd': 12,
    	'c': 25,
    	's': 38		
	};

	var IMAGE_SUIT = {
    	'h': "hearts",
    	'd': "diamonds",
    	'c': "clubs",
    	's': "spades"		
	};

	var IMAGE_VALUE = {
		't': "10",
		'j': "jack",
		'a': "ace",
		'q': "queen",
		'k': "king"
	};

	var imageFromValueSuit = function(value, suit) {
		if (IMAGE_VALUE[value] !== undefined) {
			value = IMAGE_VALUE[value];
		};
		return "../app/image/cards/" + value + "-" + IMAGE_SUIT[suit] + ".png";
	};

	var imageCardBack = function() {
		return "../app/image/card-back.png";
	};

  var cardFromValueSuit = function (value, suit) {
  	// 0=none, 1-13=2-Ah 14-26=2-Ad 27-39=2-Ac 40-52=2-As
  	// suit
  	return SUIT[suit] + value;
  };

  // in place random shuffle
 	var shuffleBySwap = function() {
 		var cards = allCards.slice(1);
 		for (var i = 0, l = cards.length; i < l - 1; i++) {
 			var j = i + Math.floor(Math.random() * (l - i));
 			// swap
 			var temp	 = cards[i];
 			cards[i]     = cards[j];
 			cards[j] 	 = temp;
 		}
 		return cards;
 	};

 	var renderCards = function(cards) {
 		var deckCardsImg = [];
  	for (var i = 0, l = cards.length; i < l; i++) {
  		deckCardsImg[i] = imageFromValueSuit(cards[i][0], cards[i][1]);
  	};
  	return deckCardsImg;
 	};

	return {
		allCards: allCards,
		imageFromValueSuit: imageFromValueSuit,
		cardFromValueSuit: cardFromValueSuit,
		shuffleBySwap: shuffleBySwap,
		imageCardBack: imageCardBack,
		renderCards: renderCards
	}
})
.factory("wsComm", [function() {
	var ws;
	var wsInit = function() {
		var port = 8080;
		var host = "localhost" || window.document.location.host.replace(/:.*/, '');
		ws = new WebSocket('ws://' + host + ':' + port);
    console.log('success web socket fun time');
  };

  // var wsSend = function(msg) {
  //  if (ws === undefined) {
  //    console.error("WebSocket has not been initialized yet!");
  //    return null;
  //  };

  //  ws.onopen = function(msg) {
  //    console.log("Sending out message: ", msg);
  //    ws.send(msg);
  //  };

  //  ws.onopen(msg);
  // };
    

  var wsUpdate = function (gameStateUpdateCb) {
    if (ws === undefined) {
      console.error("WebSocket has not been initialized yet!");
      return null;
    };
    ws.onmessage = function (evt) {
      console.log(evt.data);
      var gameState = JSON.parse(evt.data);
      gameStateUpdateCb(gameState);
    };
  };

	return {
    ws: ws,
		wsInit: wsInit,
		// wsSend: wsSend,
    wsUpdate: wsUpdate
	}
}])
.factory('httpRequest', ['$http', function($http) {
  var baseUri = "";
  var identify = function(username) {
    console.log(username);
		return $http({
      method: "POST",
      url: baseUri + "/user/",
      data: {name: username}
    })
    .success(function(stuff){
      console.log('success!')
    })
    .error(function(err){
      console.log('errors oh my');
    })
  };

  var sit = function(uid, seatId) {
    return $http({
      method: "POST",
      url: baseUri + "/sit/",
      data: {
        uid: uid,
        seat: seatId 
      }
    })
  };

  var stand = function(uid) {
    return $http({
      method: "POST",
      url: baseUri + "/play/stand/",
      data: {
        uid: uid
      }
    })
  };

  var check = function(uid) {
    return $http({
      method: "POST",
      url: baseUri + "/play/check/",
      data: {
        uid: uid
      }
    })
  };

  var call = function(uid) {
    return $http({
      method: "POST",
      url: baseUri + "/play/call/",
      data: {
        uid: uid
      }
    })
  };

  var bet = function(uid, value) {
    return $http({
      method: "POST",
      url: baseUri + "/play/bet/",
      data: {
        uid: uid,
        value: value
      }
    })
  };

  var fold = function(uid) {
    return $http({
      method: "POST",
      url: baseUri + "/play/fold/",
      data: {
        uid: uid
      }
    })
  };  

	return {
		identify: identify,
    sit: sit,
    stand: stand,
    check: check,
    fold: fold,
    bet: bet
	}
}])
.factory('gameStateEmu', [function() {
  var gameStateJSON = [];
  var gameState = {
    round: 1,
    cards: ["qh","kh","ah","2c","3s"],
    minstake: 200,
    turn: 27694,
    // turn: 33285,
    user: [
      {
        "uid": 27694,
        "name": "Bumble the Brave",
        "money": 1300,
        "stake": 0,
        "active": true,
        "hand": ["4s","4c"]        
      },
      {
        "uid": null,
        "name": "",
        "money": 0,
        "stake": 0,
        "active": false,
        "hand": []        
      },
      {
        "uid": 33285,
        "name": "Name2",
        "money": 1300,
        "stake": 0,
        "active": true,
        "hand": ["4s","4c"]        
      },
      {
        "uid": null,
        "name": "",
        "money": 0,
        "stake": 0,
        "active": false,
        "hand": []        
      },
      {
        "uid": 91137,
        "name": "Name4",
        "money": 1300,
        "stake": 0,
        "active": false,
        "hand": ["4s","4c"]        
      },
      {
        "uid": 73921,
        "name": "Name6",
        "money": 1300,
        "stake": 0,
        "active": true,
        "hand": ["4s","4c"]        
      }
    ],
    table: [
      27694,
      null,
      33285,
      null,
      91137,
      73921
    ] 
  };

  gameStateJSON.push(JSON.stringify(gameState));
  return {
    gameStateJSON: gameStateJSON
  }
}])
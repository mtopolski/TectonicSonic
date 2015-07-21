'use strict'

angular.module('app.service', [])
.factory('ViewService', [function() {

}])
.factory('Users', [function() {
// User model:
	// global uid
	var g_uid = 0;
	var User = function (uid, name) {
		this.uid = uid;
		this.name = name;
		this.money = 500;
		this.cards = [];
		// Current only show seat sequence same as uid
		this.seat = uid;
		this.cardsImg = [];
	}

	var addUser = function() {
		var userName = "user";
		var uid = g_uid++;
		var newUser = new User(uid, userName+uid);
		return newUser;
	};

	return {
		addUser: addUser
	}
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
		return "../image/cards/" + value + "-" + IMAGE_SUIT[suit] + ".png";
	};

	var imageCardBack = function() {
		return "../image/card-back.png";
	};

    var cardFromValueSuit = function (value, suit) {
    	// 0=none, 1-13=2-Ah 14-26=2-Ad 27-39=2-Ac 40-52=2-As
    	// suit
    	return SUIT[suit] + value;
    };

    var valueSuitFromCard = function(card) {
    	if (card < 0 || card > 52) {
    		return '';
    	};
    	return allCards[card];
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
			// deckCardsImg[i] = this.imageFromValueSuit(cards[i][0], cards[i][1]);
			deckCardsImg[i] = imageFromValueSuit(cards[i][0], cards[i][1]);
		};
		return deckCardsImg;
   	};

	return {
		allCards		  : allCards,
		imageFromValueSuit: imageFromValueSuit,
		cardFromValueSuit : cardFromValueSuit,
		valueSuitFromCard : valueSuitFromCard,
		shuffleBySwap     : shuffleBySwap,
		imageCardBack 	  : imageCardBack,
		renderCards 	  : renderCards
	}
})
.factory('GameEmulator', [function() {
	return {
		
	}
}])
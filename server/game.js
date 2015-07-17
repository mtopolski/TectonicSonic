var Deck = function() {
	var deck = [] 
	var value = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k', 'a'];
	var suit = ['s', 'c', 'd', 'h'];
	for (var i = 0; i < suit.length; i++) {
		for (var j = 0; j < value.length; j++) {
			deck.push(value[j] + suit[i])
		}
	}
	for (var i = 0; i < deck.length; i++) {
		var j = Math.floor(Math.random() * (deck.length - i));
		var tmp = deck[i + j];
		deck[i + j] = deck[i];
		deck[i] = tmp;
	}
	var counter = 0;
	this.nextCard = function() {
		return deck[counter++];
	}
}

//Create users
var User = function(name) {
	this.uid = assignId();
	this.name = name;
	this.money = 10000;
	this.stake = 0;
	this.active = false;
	this.hand = null;
	this.clearHand = function() {
		this.hand = null;
	}
	this.newHand = function(c1, c2) {
		this.hand = [c1, c2];
	}
}

var idCount = 0;

var assignId = function() {
	return idCount++;
}




var users = {};


//state
var table = [null, null, null, null, null, null];
var pot = 0;
var minstake = 0;
var round = 0;
var cards = ['ks', 'qh', '1c', '7d', 'as'];
var turn = null;
var deck = null;
var directive = null;

var deal = function() {
	deck = new Deck();
	for (var i = 0; i < table.length; i++) {
		if (table[i]) {
			table[i].newHand(deck.nextCard(), deck.nextCard());
			// TODO: design fair game
			turn = table[i].uid;
		}
	}
	cards = [];
	for (var i = 0; i < 5; i++) {
		cards.push(deck.nexCard());
	}
	change("deal");
}


var checkBetRaiseCall = function(amount) {
	amount = amount === undefined ? minstake - users[turn]['stake'] : amount;
	users[turn]['money'] -= amount;
	users[turn]['stake'] += amount;
	minstake += amount;
	//turn = nextPlayer();
	nextStep();
	//change();
}


var nextTurn = function() {
	//get user id of next player
	var ids = [];
	for (var i = 0; i < table.length; i++) {
		if (table[i] && table[i]['active'] === true) {
			ids.push(table[i]['uid']);
		}
	}
	retur

}

var nextStep = function() {
	//see if current betting round has concluded
	  //if so, next round
	  //else, nextTurn

	  change()
}





//passing current directive
var round = { 
	0: 'waiting to start',
	1: 'first round of betting',
	2: 'we need to write more rounds'
}


var callback;

function change(reason) {
	directive = reason;
	callback();
}

module.exports.onChange = function(cb) {
	callback = cb;
}

module.exports.serialize = function() { };

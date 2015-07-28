var poker = require('./poker.js');

var Deck = function() {
	var deck = [] 
	var value = [2, 3, 4, 5, 6, 7, 8, 9, 't', 'j', 'q', 'k', 'a'];
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
	this.hand = [];
	this.clearHand = function() {
		this.hand = [];
	}
	this.newHand = function(c1, c2) {
		this.hand = [c1, c2];
	}
}

var idCount = 1; //id 0 exists in poker.js for hand comparison, must start this at 1
var assignId = function() {
	return idCount++;
}

var MIN_BET = 100;

var users = {};
var table = [null, null, null, null, null, null];
var players = [];
var winner = null;
var pot = 0;
var minstake = 0;
var round = 0;
var cards = ['ts', 'js', 'qs', 'ks', 'as'];

var start = 0;
var last = null;
var turn = null;
var deck = null;

var deal = function() {
	console.log('dealt');
  round = 1;
  pot = 0;
  minstake = 0;
  start++;
  turn = null;
  winner = null;
	deck = new Deck();

    // deal cards
	cards = [];
	for(var i = 0; i < 5; i++) {
		cards.push(deck.nextCard());
	}

    // init players
    players = [];
	for(var i = 0; i < table.length; i++) {
		if(table[i]) {
            players.push(table[i]);
            var player = users[table[i]];
            player.active = true;
			player.newHand(deck.nextCard(), deck.nextCard());
		}
	}

    // miniblinds
    turn = players[(start-1) % players.length];
    bet(turn, MIN_BET/2);

    // blinds
    turn = nextPlayer();
    bet(turn, MIN_BET);

    update();
}

var bet = function(uid, amount) {
    var player = users[uid];
    player.money -= amount;
    player.stake += amount;
    if(player.stake > minstake) {
        minstake = player.stake;
        last = uid;
    }
}

var checkBetRaiseCall = function(amount) {
  if(amount === -1) {
  	amount = callAmount();
  	console.log('call amount: ', amount);
  }
  bet(turn, amount);
	next();
}

var countPlayers = function() {
	var count = 0;
	for(var i = 0; i < players.length; i++) {
		if (users[players[i]].active) {
			count++;
			temp = users[players[i]].uid;
		}
	}
	return count;
}

module.exports.checkBetRaiseCall = checkBetRaiseCall;
var fold = function() {
    var player = users[turn];
    player.active = false;
    pot += player.stake;
    player.stake = 0;
	next();
}
module.exports.fold = fold;
var callAmount = function() {
	return minstake - users[turn].stake;
}

var next = function() {
    var np = nextPlayer();
    var count = countPlayers();
    if(count === 1) {
    	round = 4;
    }
    if(np === last) {
        round++;
        minstake = 0;
        for(var i = 0; i < players.length; i++) {
            var player = users[players[i]];
            pot += player.stake;
            player.stake = 0;
        }
        if(round === 5) {
            winner = poker.best(userArray(), cards)[0];
            turn = null;
            console.log("winner: ", winner);
            users[winner].money += pot;
            pot = 0;
            setTimeout(deal, 5000);
        } else {
            turn = players[start % players.length];
        }
    }
    else
        turn = np;
    update();
}

var nextPlayer = function() {
	var int = players.indexOf(turn);
	for(var i = 1; i < players.length + 1; i++) {
		var j = (int + i) % players.length; 
		if(users[players[j]].active) {
			return players[j];
		}
	}
	return players[(players.indexOf(turn) + 1) % players.length];
}

module.exports.addUser = function(userName) {
	var user = new User(userName);
	users[user.uid] = user;
	return user.uid;
}

var countTable = function() {
	var count = 0;
	for(var i = 0; i < table.length; i++) {
		if(table[i]) {
			count++
		}
	}
	return count;
}

module.exports.sitUser = function(uid, seat) {
	if(!table[seat]) {
		table[seat] = uid;
		if (round === 0 && countTable() > 1){
			deal();
		} else {
			update();
		}
	}
}

module.exports.stand = function(uid) {
	for(var i = 0; i < table.length; i++) {
		if(table[i] == uid) {
			table[i] = null;
		}
	}
	fold();
}


var callback;

function update() {
	callback();
}

module.exports.onUpdate = function(cb) {
	callback = cb;
}

function userArray() {
	var result = [];
	for (var i = 0; i < table.length; i++) {
		if(table[i]) {
			var user = users[table[i]];
		  result.push(user);
		}
	}
	return result;
}

module.exports.serialize = function() {
	var s = JSON.stringify({
	  "round": round,
	  "cards": cards,
	  "minstake": minstake,
	  "turn": turn,
	  "users": userArray(),
	  "table": table,
	  "pot": pot,
	  "winner": winner
    });
	return s;
};

module.exports.best = function(table, shown) {
	var players = {0: 0};
	for (var i = 0; i < table.length; i++) {
		if (table[i].active === true) {
			players[table[i].uid] = determineHand(table[i].hand, shown);
		}
	}
	for (var x in players) {
		players[x] = judgementDay(players[x]);
	}
	var winners = [0];
	for (var x in players) {
		if (player[x] > player[winners[0]]) {
			winners = x;
		} else if (player[x] === player[winners[0]]) {
			winners.push(x);
		}
	}
	return winners;
}

var cardVals = {
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	't': 10,
	'j': 11,
	'q': 12,
	'k': 13,
	'a': 14 
}

function determineHand(hand, shown) {
	var newHand = [];
	for (var i = 0; i < hand.length; i++) {
		newHand.push([cardVals[hand[i][0]], hand[i][1]]);
		if (hand[i][0] === 'a') {
			newHand.push([1, 'q']);
		}
	}
	newHand.concat(determineHand(shown));
	return newHand;
}

var judgementDay = function(cards) {
	cards.sort(function(e1, e2) {
		return e1[0] - e2[0];
	});
	var high = cards[cards.length - 1][0];
	var straight = hasStraight(cards);
	var shigh = straight[1];
	var flush = hasFlush(cards);
	var fhigh = flush[1];

	if (straight[0] && hasFlush(cards)) {
		return 9000 + shigh;
	}
	if (hasFours(cards)) {
		return 8000 + high;
	}
	if (hasThrees(cards) && hasOnePair(cards)) {
		return 7000 + high;
	}
	if (hasFlush(cards)) {
		return 6000 + fhigh;
	}
	if (straight[0]) {
		return 5000 + shigh;
	}
	if (hasThrees(cards)) {
		return 4000 + high;
	}
	if (hasTwoPair(cards)) {
		return 3000 + high;
	}
	if (hasOnePair(cards)) {
		return 100 + high;
	}
	return high;
}

var hasStraight = function(cards) {
	var count = 1;
	for(var i = cards.length-2; i >=0; i--) {
		if(cards[i+1][0] - cards[i][0] === 1) count++;
		if(count === 5) return ["true", cards[i][0]+4];
	}
	return [false, 0];
}

var hasFlush = function(cards) {
	var suitObj =  suits(cards);
	var has = false
	var fhigh = 0;
	for(var x in suitObj) {
		if (suitObj[x][0] >= 5) {
			has = true;
			fhigh = suitObj[x][1];
		}
	}
	return [has, fhigh];
}

var hasFours = function(cards) {
	var table = count(cards);
	var c=0;
	for(var k in table) {
		if(table[k] === 4) return true;
	}
	return false;
}

var hasThrees = function(cards) {
	var table = count(cards);
	var c=0;
	for(var k in table) {
		if(table[k] === 3) return true;
	}
	return false;
}

var hasTwoPair = function(cards) {
	var table = count(cards);
	var c=0;
	for(var k in table) {
		if(table[k] === 2) {
			c++;
		}
		if(c === 2)
			return true;
	}
	return false;
}

var hasOnePair = function(cards) {
	var table = count(cards);
	for(var k in table) {
		if(table[k] === 2) return true;
	}
	return false;
}

var count = function(cards) {
	var table = {};
	for(var i = 0; i < cards.length; i++) {
		var count = table[cards[i][0]] || 0;
		table[cards[i][0]] = count+1;
	}
	return table;
}

var suits = function(cards) {
	var table = {};
	var suit = [];
	for(var i = 0; i < cards.length; i++) {
		suit = table[cards[i][1]] || [0, 0];
		suit[1] = Math.max(suit[1], cards[i][0]);
		suit[0]++;
		table[cards[i][1]] = suit;
	}
	return table;
}

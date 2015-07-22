module.exports.best = function(table, shown) {
  var players = {};
  for (var i = 0; i < table.length; i++) {
    if (table[i].active === true) {
      players[table[i].uid] = determineHand(table[i].hand, shown);
    }
  }
  for (var x in players) {
    players[x] = judgementDay(players[x]);
  }
  var winners;
  for (var x in players) {
    console.log(players[x]);
    if (winners === undefined || players[x] > players[winners[0]]) {
      winners = [x];
    } else if (players[x] === players[winners[0]]) {
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
  var newHand = newHand || [];
  for (var i = 0; i < hand.length; i++) {
    newHand.push([cardVals[hand[i][0]], hand[i][1]]);
    if (hand[i][0] === 'a') {
      newHand.push([1, hand[i][1]]);
    }
  }
  if (shown) {
    newHand = newHand.concat(determineHand(shown));
  }
  return newHand;
}

var judgementDay = function(cards) {
  cards.sort(function(e1, e2) {
    return e1[0] - e2[0];
  });
  var high = {   //object that returns kicker (except for two pair, that shit took some love and is handled separately)
    fourOf: function() {
      var high = 0;
      for (var x in cards) {
        if (cards[x][0] !== fhigh && cards[x][0] > high) {
          high = cards[x][0];
        }
      }
      return high;
    },
    threeOf: function() {
      var high = 0;
      for (var x in cards) {
        if (cards[x][0] !== thHigh && cards[x][0] > high) {
          high = cards[x][0];
        }
      }
      return high;
    },
    pairOf: function() {
      var high = 0;
      for (var x in cards) {
        if (cards[x][0] !== opHigh && cards[x][0] !== tpHigh && cards[x][0] > high) {
          high = cards[x][0];
        }
      }
      return high;
    },
    highCard: function() {
      return cards[cards.length - 1][0]
    }
  }
  var straight = hasStraight(cards);
  var shigh = straight[1] * 20;
  var flush = hasFlush(cards);
  var fhigh = flush[1] * 20;
  var fourOf = hasFours(cards);
  var qhigh = fourOf[1] * 20;
  var threeOf = hasThrees(cards);
  var thHigh = threeOf[1] * 20;
  var pairOf = hasOnePair(cards);
  var opHigh = pairOf[1] * 20;
  var twoPair = hasTwoPair(cards);
  var tpHighPair = twoPair[1] * 50;
  var tpLowPair = twoPair[2] * 20;
  var tpHigh = twoPair[3];

  if (straight[0] && flush[0] && shigh === fhigh) {
    return 9000 + shigh;
  }
  if (fourOf[0]) {
    return 8000 + qhigh + high['fourOf']();
  }
  if (threeOf[0] && pairOf[0]) {
    return 7000 + thHigh + (opHigh/20);
  }
  if (flush[0]) {
    return 6000 + fhigh; 
  }
  if (straight[0]) {
    return 5000 + shigh;
  }
  if (threeOf[0]) { 
    return 4000 + thHigh + high['threeOf']();
  }
  if (twoPair[0]) {
    return 3000 + tpHighPair + tpLowPair + tpHigh; 
  }                                        
  if (pairOf[0]) {
    return 100 + opHigh + high['pairOf']();
  }
  return high['highCard']();
}

var hasStraight = function(cards) {
  var count = 1;
  var has = false;
  var shigh = 0;
  for(var i = cards.length-2; i >=0; i--) {
    if(cards[i+1][0] - cards[i][0] === 1) {
      count++;
    } else {
      count = 1;
    }
    if(count >= 5) {
      has = true;
      shigh = cards[i][0] + 4;
    }
  }
  return [has, shigh];
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
  var has = false;
  var qhigh = 0;
  for(var k in table) {
    if(table[k] === 4) {
      has = true;
      qhigh = parseInt(k);
    }
  }
  return [has, qhigh];
}

var hasThrees = function(cards) {
  var table = count(cards);
  var has = false;
  var thHigh = 0;
  for(var k in table) {
    if(table[k] === 3) {
      has = true;
      thHigh = parseInt(k);
    }
  }
  return [has, thHigh];
}

var hasTwoPair = function(cards) {
  var table = count(cards);
  var has = false;
  var tpHigh = 0;
  var highPair = 0;
  var lowPair = 0;
  var c = 0;
  for(var k in table) {
    if(table[k] === 2) {
      c++; //lol c++
      if (parseInt(k) > highPair && highPair >= lowPair) {
        lowPair = highPair;
        highPair = parseInt(k);
      } else if (parseInt(k) > lowPair && parseInt(k) < highPair) {
        lowPair = parseInt(k);
      }
    }
    if(c === 2) {
      has = true;
    }
  }
  for (var x in cards) {
    var val = cards[x][0]
    if (val > tpHigh && val !== lowPair && val !== highPair) {
      tpHigh = val;
    }
  }
  return [has, highPair, lowPair, tpHigh];
}

var hasOnePair = function(cards) {
  var table = count(cards);
  var has = false;
  var opHigh = 0;
  for(var k in table) {
    if(table[k] === 2) {
      has = true;
      opHigh = parseInt(k) > opHigh ? parseInt(k) : opHigh;
    }
  }
  return [has, opHigh];
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
  for (var x in table) {
    if (table[x][1] === 14) {
      table[x][0]--;
    }
  }
  return table;
}

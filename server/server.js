var game = require('./game.js');

game.onUpdate(function() {
	wss.broadcast(game.serialize());
});

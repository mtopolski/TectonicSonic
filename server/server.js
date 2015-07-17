var game = require('./game.js');

game.onChange(function() {
	wss.broadcast(game.serialize());
});
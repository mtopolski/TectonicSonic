var fs = require("fs");

var SERVER_IP   = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var SERVER_PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var WebSocketServer = require('ws').Server
var http = require('http');
var qs = require('querystring');

var server = http.createServer(function(request, response) {
    //console.log((new Date()) + ' Received request for ' + request.url);
    //if(request.url[request.url.length-1] === "/") request.url += "index.html";

    if(request.url==="/user/") {
        var data=""; request.on("data", function(d) {data+=d;}); request.on("end", function() {
            data=qs.parse(data);
        });
    }
    if(request.url==="/sit/") {}
    if(request.url==="/stand/") {}
    if(request.url==="/check/") {}
    if(request.url==="/call/") {}
    if(request.url==="/bet/") {}
    if(request.url==="/fold/") {}
    else fs.readFile("public"+request.url, function(err, data) {
        if(err) {
            response.writeHead(404);
            response.end("404 not found");
        }
        else {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        }
    });
});

server.listen( SERVER_PORT, SERVER_IP, function() {
    console.log((new Date()) + "Server started");
    console.log("Listening to " + SERVER_PORT + ":" + SERVER_IP + "...");
});

// --------------------------------------------------------------------------------

var game = require('./game.js');
var wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: false
});

wss.broadcast = function(data) {
    wss.clients.forEach(function(client) {
        client.send(data);
    });
};

// --------------------------------------------------------------------------------

wss.on('connection', function(ws) {
	wss.broadcast(game.serialize());
});

game.onUpdate(function() {
	wss.broadcast(game.serialize());
});

var fs = require("fs");

var SERVER_IP   = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var SERVER_PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var WebSocketServer = require('ws').Server
var http = require('http');
var qs = require('querystring');

var server = http.createServer(function(request, response) {
    //console.log((new Date()) + ' Received request for ' + request.url);
    //if(request.url[request.url.length-1] === "/") request.url += "index.html";

    // var data=""; request.on("data", function(d) {data+=d;}); request.on("end", function() {
    //     data=JSON.parse(data);
    // });

    if(request.url==="/user/") {
        var data=""; request.on("data", function(d) {data+=d;}); request.on("end", function() {
            data=JSON.parse(data);
            console.log(data);
            console.log(data.name);
            var id = game.addUser(data.name);
            response.end('' + id);
        });
    }
    if(request.url==="/sit/") {
        var data=""; request.on("data", function(d) {data+=d;}); request.on("end", function() {
            console.log(data);
            data=JSON.parse(data);
            game.sitUser(data.uid, data.seat);
            response.end('');
        });

    }
    if(request.url==="/stand/") {}
    if(request.url==="/check/") {}
    if(request.url==="/call/") {}
    if(request.url==="/bet/") {}
    if(request.url==="/fold/") {}
    else fs.readFile("../client"+request.url, function(err, data) {
        if(err) {
            response.writeHead(404);
            response.end("404 not found");
        }
        else {
            response.writeHead(200, {});
            response.end(data);
        } 
    });
});

server.listen( SERVER_PORT, SERVER_IP, function() {
    console.log((new Date()) + "Server started");
    console.log("Listening to " + SERVER_IP + ":" + SERVER_PORT + "...");
});

// --------------------------------------------------------------------------------

var game = require('./game.js');
var wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: true
});

wss.broadcast = function(data) {
    wss.clients.forEach(function(client) {
        client.send(data);
    });
};

// --------------------------------------------------------------------------------

wss.on('connection', function(ws) {
    console.log(game.serialize());
	wss.broadcast(game.serialize());
});

game.onUpdate(function() {
	wss.broadcast(game.serialize());
});

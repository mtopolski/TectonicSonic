## Team Tectonic Sonic ##

Relax. You're here. No pain, no fear. You're with the best now.

## Server Websocket ##

The client should connect to server to receive information on the game state. Example websocket connection:

```
var ws = new WebSocket("ws://example.com:8000");
ws.onopen(function() {
  ws.onmessage(function(data) {
    var gameState = JSON.parse(data);
    // ...update accordingly
  });  
});
```
On connection and on changes to the server game state, the server will broadcast a JSON string:

```
{
  "round": 1,
  "cards": ["qh","kh","ah","2c","3s"],
  "minstake": 200,
  "turn": 27694,
  "users": [
    {
        "uid": 27694,
        "name": "Bumble the Brave",
        "money": 13,
        "stake", 0,
        "active": true,
        "hand": ["4s","4c"]
    },
    {...}
  ]
}
```

## URI Endpoints ##

The server requires a uid for participation with the game. For the player to interact properly, identify with the server.

#### identify ####
post: `/user/`  
requires: `{name: String}`  
returns: `{uid: Number}`  

After identifying, a player can:

#### sit ####
post: `/sit/`  
requires: `{uid: Number, seat: Number}`  

A player at a table may:

#### stand ####
post: `/play/stand/`  
requires: `{uid: Number}`  

Once in game, the player, depending on whether it is their turn, may:

#### check ####
post: `/play/check/`  
requires: `{uid: Number}`  
#### call ####
post: `/play/call/`  
requires: `{uid: Number}`  
#### bet ####
post: `/play/bet/`  
requires: `{uid: Number, value: Number}`  
#### fold ####
post: `/play/fold/`  
requires: `{uid: Number}`  

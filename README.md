## Team Tectonic Sonic ##

Relax. You're here. No pain, no fear. You're with the best now.

## API ##

The server requires a uid for participation with the game. For the player to interact properly, identify with the server.

#### identify ####
post: `/user/`  
requires: `{name: String}`  
returns: `{uid: Number}`  

After identifying, a player can:

#### sit ####
post: `/sit/`  
requires: `{uid: Number, seat: Number}`  

Once in the game, the player, depending on whether it is their turn, may:

#### stand ####
post: `/play/stand/`  
requires: `{uid: Number}`  

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

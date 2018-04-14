"use strict";

class ArenaController{
    constructor(game){
        this.game = game;

    }

    handleMove(message){
        console.log("handling message" + JSON.stringify(message));
        if(message.data.type === "move"){
            this.game.state.states.Arena.updateHealth(message);
        }
    }

    endGame(message) {
    	console.log("Received game end, handling! : " + JSON.stringify(message));
    	if (message.data.type == "outcome") {
    		this.game.state.states.Arena.endGame(message);
    	}
    }

}
export default ArenaController;
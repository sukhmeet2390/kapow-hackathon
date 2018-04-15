"use strict";

class ArenaController{
    constructor(game){
        this.game = game;
        return this;
    }

    handleMove(message){
        console.log("handling message" + JSON.stringify(message));
        if(message.type === "move" && message.data.type === "Move"){
            this.game.state.states.Arena.opponentMove(message);
        }
    }

    endGame(message) {
    	console.log("Received game end, handling! : " + JSON.stringify(message));
    	if (message.type === "outcome") {
    		this.game.state.states.Arena.endGame(message);
    	}
    }

    handleTurnChange(message) {
        console.log("Received turn change message, handling : " + JSON.stringify(message));
        // this.game.state.states.Arena.turnChange(message);

    }

}
export default ArenaController;
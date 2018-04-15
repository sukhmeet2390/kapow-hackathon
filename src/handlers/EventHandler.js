"use strict";
import GameController from "./GameControllers";
import ArenaController from "./ArenaController";

let EventHandler = {
    init() {
        console.log("Event handler init");
        let game = window.phasergame;
        this.game = window.phasergame;
        this.gameController = new GameController(game);
        this.arenaController = new ArenaController(game);
        pubsub.subscribe("menu/playButtonClicked", this.gameController.initNewGame);
        pubsub.subscribe("kapow/game/messageReceived", this._handleMessage);
        // pubsub.subscribe("kapow/game/turnChange", this._handleTurnChange);
        pubsub.subscribe("kapow/game/playerJoined", this._handlePlayerJoined);
        pubsub.subscribe("kapow/game/backButtonPressed", this._handleBackButton());
    },
    _handleBackButton() {
        console.log("Handling back button press!");
        window.phasergame.state.getCurrentState()._handleBackButton();
    },
    _handleTurnChange(player) {
        console.log("Handle turn change ", player);
        window.phasergame.state.states.Arena.turnChange(player);
    },
    _handlePlayerJoined(player) {
        console.log("Handle turn change ", player);
        window.phasergame.state.states.Arena.setTurn();
    },
    _handleMessage(message) {
        console.log("Message received", message);
        switch (message.type) {
            case "move":
                if(message.data.type === "Move"){
                    window.phasergame.state.states.Arena.opponentMove(message);
                }
                break;
            case "outcome":
                this.arenaController.endGame(message);
                break;
            case "turn_change":
                break;
            case "affiliation_change":
                break;
            case "room_lock_status":
                break;
            default:
                break;
        }

    }
};

export default EventHandler;
"use strict";
import GameController from "./GameControllers";
import ArenaController from "./ArenaController";

let EventHandler = {
    init() {
        console.log("Event handler init");

        let game = window.phasergame;
        this.gameController = new GameController(game);
        this.arenaController = new ArenaController(game);
        pubsub.subscribe("menu/playButtonClicked", this.gameController.initNewGame);
        pubsub.subscribe("kapow/game/messageReceived", this._handleMessage);
    },

    _handleMessage(message) {
        console.log("Message received", message);
        switch (message.type) {
            case "move":
                this.arenaController.handleMove(message);
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
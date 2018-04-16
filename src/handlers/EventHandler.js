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

        pubsub.subscribe("kapow/game/messageReceived", this._handleMessage);
        pubsub.subscribe("kapow/game/turnChange", this._handleTurnChange);
        pubsub.subscribe("kapow/game/playerJoined", this._handlePlayerJoined);
        pubsub.subscribe("kapow/game/backButtonPressed", this._handleBackButton);
        pubsub.subscribe("kapow/game/resumed", this._handleOnResume);
    },
    _handleOnResume(val) {
        console.log("Handling on resume : " + val);
        if (window.phasergame.state.current !== "Preload") window.phasergame.state.start("Preload");
    },
    _handleBackButton(val) {
        console.log("Handling back button press! : " + val);
        if (window.phasergame) window.phasergame.state.getCurrentState()._handleBackButton();
    },
    _handleTurnChange(player) {
        console.log("Handle turn change ", player);
        if (window.phasergame.state.current !== "Arena") return;
        window.phasergame.state.states.Arena.turnChange(player);
    },
    _handlePlayerJoined(player) {
        console.log("Handle turn change ", player);
        if (window.phasergame.state.current !== "Arena") return;
        window.phasergame.state.states.Arena.setTurn();
    },
    _handleMessage(message) {
        console.log("Message received", message);
        switch (message.type) {
            case "move":
                if(message.data.type === "Move"){
                    if (window.phasergame.state.current !== "Arena") return;
                    window.phasergame.state.states.Arena.opponentMove(message);
                }

                if (message.data.type === "HeartMove" && window.phasergame.state.current === "Arena") {
                    window.phasergame.state.states.Arena.opponentHealthMove(message);
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
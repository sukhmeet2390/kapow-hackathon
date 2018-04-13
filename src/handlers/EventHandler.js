"use strict";
import GameController from "./GameController";
import ArenaController from "./ArenaController";

let EventHandler = {
    init() {
        this.gameController = new GameController();
        this.arenaController = new ArenaController();
        pubsub.subscribe("menu/playButtonClicked", this.gameController.initNewGame);
    }
};

export default EventHandler;
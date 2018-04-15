"use strict";
import Player from "./Player";
import Power from "./Power";

export default class Tom extends Phaser.Sprite {
    constructor(game, x, y, label, jid) {
        super(game, x, y, label);
        this.anchor.setTo(0.5);
        this.image = this.game.add.sprite(x, y, label);
        this.player = new Player("Tom", jid, [new Power("sanskar", 10), new Power("heart", 10)]);
    }
}
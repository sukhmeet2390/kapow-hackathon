"use strict";
import Player from "./Player";
import Power from "./Power";

export default class Tom extends Phaser.Sprite {
    constructor(game, x, y, label, jid) {
        super(game, x, y, label);
        this.anchor.setTo(0.5);
        this.frame = 0;
        this.game.add.sprite(x, y, label);
        this.player = new Player("Tom", jid, [new Power("bone", 10), new Power("fish", 10)]);
    }
}
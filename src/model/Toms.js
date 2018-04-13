"use strict";
import Player from "./Player";
import Power from "./Power";

export default class Tom extends Phaser.Sprite{
    constructor(game, x, y, label) {
        super(game, x, y, label);
        this.anchor.setTo(0.5);
        this.frame = 0;
        this.player = new Player("Tom", [new Power("bone", 10), new Power("fish", 10)]);
    }
}
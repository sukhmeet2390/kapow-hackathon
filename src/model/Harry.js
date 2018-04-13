"use-strict"
import Player from "./Player";

export default class Harry extends Phaser.Sprite {
    constructor(game, x, y, label) {
        super(game, x, y, label);
        this.anchor.setTo(0.5);
        this.frame = 0;
        this.player = new Player("Harry", ["p1", "p2"]);
    }
}
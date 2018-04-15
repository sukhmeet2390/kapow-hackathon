"use-strict"
import Player from "./Player";

export default class Harry extends Phaser.Sprite {
    constructor(game, x, y, label, jid) {
        super(game, x, y, label);
        this.anchor.setTo(0.5);
        this.frame = 0;
        this.game.add.sprite(x, y, label);
        this.player = new Player("Harry", jid, ["p1", "p2"]);
    }
}
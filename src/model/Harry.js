import Power from "./Power";

"use-strict"
import Player from "./Player";

export default class Harry extends Phaser.Sprite {
    constructor(game, x, y, label, jid) {
        super(game, x, y, label);
        this.anchor.setTo(0.5);
        this.game.add.sprite(x, y, label);
        this.player = new Player("Harry", jid, [new Power("gun", 10), new Power("heart", 10)]);
    }
}
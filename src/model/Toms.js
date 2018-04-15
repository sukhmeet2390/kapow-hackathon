"use strict";
import Player from "./Player";
import Power from "./Power";

export default class Tom extends Phaser.Sprite {
    constructor(game, x, y, jid) {
        let label = 'tom-left';
        if (x > 600) {
            label = 'tom-right';
        }
        super(game, x, y, label);
        this.anchor.setTo(0.5);
        this.image = this.game.add.sprite(x, y, label);
        this.player = new Player("Tom", jid, [new Power("sanskar", 10), new Power("heart", 10)]);
        this.music = this.game.add.audio('tom-sound');
    }

    playerHit() {
        let self = this;
        let label = 'tom-hit-left';
        let x = this.position.x;
        let y = this.position.y;

        if (x > 600) {
            label = 'tom-hit-right';
        }
        self.hitImage = this.game.add.sprite(x, y, label);

        setInterval(function () {
            self.hitImage.destroy();
        }, 200);
    }

    playSuccess() {
        this.game.sound.stopAll();
        this.music.play();
    }
}
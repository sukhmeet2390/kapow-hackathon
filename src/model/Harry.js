import Power from "./Power";

"use-strict"
import Player from "./Player";

export default class Harry extends Phaser.Sprite {
    constructor(game, x, y, jid) {
        let label = 'harry-left';
        if (x > 600) {
            label = 'harry-right';
        }
        super(game, x, y, label);
        this.anchor.setTo(0.5);
        this.image = this.game.add.sprite(x, y, label);
        this.image.scale.setTo(1.23, 1.23);
        this.player = new Player("Harry", jid, [new Power("gun", 10), new Power("heart", 10)]);
        this.music = this.game.add.audio('harry-sound');
    }

    playerHit() {
        let self = this;
        let label = 'harry-hit-left';
        let x = this.position.x;
        let y = this.position.y;

        if (x > 600) {
            label = 'harry-hit-right';
        }
        self.hitImage = this.game.add.sprite(x, y, label);

        setInterval(function () {
            self.hitImage.destroy();
        }, 400);
    }

    playSuccess() {
        this.game.sound.stopAll();
        this.music.play();
    }

    showHealthMove(arena) {
        this.heartButton = this.game.add.button(200, 200, 'bt', arena.sendHealthMove, this, 0, 0, 0);
    }

    removeHealthButton() {
        this.heartButton.destroy();
    }
}
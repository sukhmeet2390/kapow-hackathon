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
}
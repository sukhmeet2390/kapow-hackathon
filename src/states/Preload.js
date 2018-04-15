import * as PhaserUi from 'phaser-ui';
import kapowWrapper from "../kapow/KapowWrapper";

class Preload extends Phaser.State {

    preload() {
        this.game.load.image('button', 'assets/playGame.png');
    }

    create() {
        console.log("Loading started!");

        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(true, false);

        this.loading = new PhaserUi.ProgressBar(this.game, 1300, 150, PhaserUi.Graphics.roundedRectBmd, 4, '', 0xFFF000);
        this.loading.x = this.game.world.centerX;
        this.loading.y = this.game.world.centerY;

        var self = this;
        var id = setInterval(function () {
            let prog = self.loading.progress;
            self.loading.progress = prog + 0.1;
            if (self.loading.progress >= 0.999999) {
                clearTimeout(id);
                self.game.state.start("Arena");
                kapowWrapper.getRoomInfo(function (room) {
                    if (!room) {
                        console.log("No Room Found");
                        self.game.state.start("Menu");
                    } else {
                        console.log("Found room. Going to arena ", room);
                        self.game.state.start("Arena");
                    }
                });

            }
        }, 150);
    }

    update() {

    }
}

export default Preload;

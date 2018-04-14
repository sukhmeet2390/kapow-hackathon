import * as PhaserUi from 'phaser-ui';

class Preload extends Phaser.State {

    preload() {
        /* Preload required assets */
        //this.game.load.image('myImage', 'assets/my-image.png');
        //this.game.load.audio('myAudio', 'assets/my-audio.wav');
        //this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json');
        //this.game.load.crossOrigin = "anonymous";

        this.game.load.image('button', 'assets/playGame.png');
        this.game.load.image('bg', 'assets/playGame.png');
    }

    create() {
        console.log("Loading started!");

        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(true, false);

        this.loading = new PhaserUi.ProgressBar(this.game, 600, 200, PhaserUi.Graphics.roundedRectBmd, 4, '', 0xFFF000);
        this.loading.x = this.game.world.centerX;
        this.loading.y = this.game.world.centerY;

        var self = this;
        var id = setInterval(function () {
            let prog = self.loading.progress;
            self.loading.progress = prog + 0.1;
            if (self.loading.progress >= 0.999999) {
                console.log("Loading finished, calling Menu state");
                clearTimeout(id);
                self.game.state.start("Arena");
            }
        }, 200);
    }

    update() {

    }
}

export default Preload;

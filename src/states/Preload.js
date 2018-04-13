import * as PhaserUi from 'phaser-ui';

class Preload extends Phaser.State {

    preload() {
        /* Preload required assets */
        //this.game.load.image('myImage', 'assets/my-image.png');
        //this.game.load.audio('myAudio', 'assets/my-audio.wav');
        //this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json');
        this.game.load.crossOrigin = "anonymous";
        this.game.load.image('tom', 'assets/player.png');
    }

    create() {
        //NOTE: Change to GameTitle if required
        //let bar = new PhaserUi.ProgressBar(this.game, 200, 40, 'progress-bar', 20, '');
        this.loading = new PhaserUi.ProgressBar(this.game, 300, 100, null, 4, '');
        this.loading.x = this.game.world.centerX - 100;
        this.loading.y = this.game.world.centerY;
        var self = this;
        var id= setInterval(function(){
            let prog= self.loading.progress;
            self.loading.progress = prog+0.1;
            console.log(self.loading.progress);
            if(self.loading.progress === 0.999999){
                console.log("Clear");
                clearTimeout(id);
                self.game.state.start("Menu");
            }
        }, 100);
    }

    update() {

    }
}

export default Preload;

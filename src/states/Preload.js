import * as PhaserUi from 'phaser-ui';
import kapowWrapper from "../kapow/KapowWrapper";

class Preload extends Phaser.State {

    preload() {
        this.load.onLoadComplete.addOnce(this._onLoadComplete, this);

        this.loading = new PhaserUi.ProgressBar(this.game, 1300, 100, PhaserUi.Graphics.roundedRectBmd, 4, '', 0xFFF000);
        this.loading.x = this.game.world.centerX;
        this.loading.y = this.game.world.centerY;

        var self = this;
        setTimeout(function () {
            self.loading.progress = self.loading.progress + 0.1;
        }, 1000);


        this.game.load.audio('gameSound', 'assets/audio/Theme.mp3', true);
        this.game.load.audio('tom-sound', 'assets/audio/tom.mp3', true);
        this.game.load.audio('harry-sound', 'assets/audio/harry.mp3', true);
        // Menu
        this.game.load.image('welcome', 'assets/final/welcome.png');
        this.game.load.image('bt', 'assets/final/bt-play.png');
        // Lobby
        this.load.image("block1", "assets/final/lobby_prem.png");
        this.load.image("block2", "assets/final/lobby_babu.png");
        this.load.image("play", "assets/final/bt-battle.png");
        // Arena
        this.game.load.image('tom-left', 'assets/final/left/char-babuji-standing.png');
        this.game.load.image('tom-right', 'assets/final/right/char-babuji-standing.png');
        this.game.load.image('tom-hit-left', 'assets/final/left/char-babuji-ouch.png');
        this.game.load.image('tom-hit-right', 'assets/final/right/char-babuji-ouch.png');
        this.game.load.image('tom-heart', 'assets/final/potion.png');
        // this.game.load.image('tom-loaded', 'assets/final/char-babuji-kalash.png');

        this.game.load.image('harry-left', 'assets/final/left/char-prem-standing.png');
        this.game.load.image('harry-right', 'assets/final/right/char-prem-standing.png');
        this.game.load.image('harry-hit-left', 'assets/final/left/char-prem-hit.png');
        this.game.load.image('harry-hit-right', 'assets/final/right/char-prem-hit.png');
        this.game.load.image('harry-heart', 'assets/final/heart.png');
        // this.game.load.image('harry-loaded', 'assets/final/char-prem-gun.png');

        this.game.load.image('wall', 'assets/final/wall.png');
        this.game.load.image('bg', 'assets/final/bg-fight.png');
        this.game.load.image('projectile', 'assets/final/projectile-bullet.png');
        // Game over
        this.game.load.spritesheet('share-bg', 'assets/final/bg-fight.png');
        this.game.load.image('replay', 'assets/final/home.png');
        this.load.image('fbShare', 'assets/final/share-fb.png');
        this.load.image('tweetShare', 'assets/final/share-twitter.png');
        this.load.image('win', 'assets/final/win.png');
        this.load.image('lose', 'assets/final/lose.png');

        this.game.load.crossOrigin = "anonymous";
    }

    create() {
        console.log("Loading started!");

        this.theme = this.game.add.audio('gameSound');
        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(true, false);

        var self = this;
        this.game.sound.setDecodedCallback(['gameSound', 'tom-sound', 'harry-sound'], function(){
            console.log('sounds are ready');
            this.theme.play();
            var id = setInterval(function () {
                let prog = self.loading.progress;
                self.loading.progress = prog + 0.1;
                if (self.loading.progress >= 0.999999) {
                    clearTimeout(id);
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
            }, 200);
        }, this);

    }

    _handleBackButton() {
        console.log("Back button inside preload!");
    }

    update() {

    }

    _onLoadComplete() {

    }
}

export default Preload;

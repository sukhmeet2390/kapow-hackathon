import KapowWrapper from "../kapow/KapowWrapper";

class GameOver extends Phaser.State {

    preload() {
        this.game.load.spritesheet('share-bg', 'assets/final/bg-fight.png');
        this.game.load.image('replay', 'assets/final/home.png');
        this.load.image('fbShare', 'assets/final/share-fb.png');
        this.load.image('tweetShare', 'assets/final/share-twitter.png');
        this.load.image('win', 'assets/final/win.png');
        this.load.image('lose', 'assets/final/lose.png');
    }

    init(text) {
        console.log("Text : " + text);
        if (!text) this.text = "Great Job !";
        if (text === "Win") this.win = true;
        else this.win = false;
    }

    create() {
        this.shareBackground = this.game.add.image(0, 0, 'share-bg');
        let fbShare = this.game.add.button(850, 690, 'fbShare', this._handleFbClick, this, 2, 1, 0);
        let tweetShare = this.game.add.button(980, 690, 'tweetShare', this._handleTweetClick, this, 2, 1, 0);
        this.game.add.button(820, 572, 'replay', this.restartGame, this, 2, 1, 0);

        console.log("Game over screen!");
        if (this.win) {
            this.game.add.image(597, 366, 'win');
        } else {
            this.game.add.image(597, 366, 'lose');
        }

    }

    restartGame() {
        var self = this;
        kapow.unloadRoom(function() {
            console.log("Successfully unloaded room!");
            self.game.state.start("Lobby");
        });
    }

    _handleFbClick() {
        console.log("FB Share");
        KapowWrapper.share(this.text, 'facebook', function () {
            console.log('Fb Share successful');
        });
    }

    _handleTweetClick() {
        console.log("Tweet Share");
        KapowWrapper.share(this.text, 'twitter', function () {
            console.log('Tweet Share successful');
        });
    }

    _handleBackButton() {
        console.log("Back button inside game over!");
        kapow.unloadRoom(function() {
            console.log("Unloaded room");
            kapow.close();
        });
    }
}

export default GameOver;

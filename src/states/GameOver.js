import SocialShare from "../model/SocialShare";
import KapowWrapper from "../kapow/KapowWrapper";

class GameOver extends Phaser.State {

    preload() {
        this.game.load.image('replay', 'assets/playGame.png');
        this.load.image('fbShare', 'assets/fb.png');
    }
    init(text){
        if(!text) this.text = "Great Job !";
    }
    create() {
        console.log("Game over screen!");
        this.shareBackground = this.game.add.sprite(72, 1584, 'shareBackground');
        //this.clickables.add(this.shareBackground);
        let fbShare = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 100,
            'fbShare', this._handleFbClick, this, 2, 1, 0);
        fbShare.anchor.setTo(0.5);

        let tweetShare = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 400,
            'fbShare', this._handleTweetClick, this, 2, 1, 0);
        tweetShare.anchor.setTo(0.5);

        this.game.add.button(this.game.world.centerX, this.game.world.centerY ,
            'replay', this.restartGame, this, 2, 1, 0);

    }

    restartGame() {
        this.game.state.start("Lobby");
    }

    _handleFbClick() {
        console.log("FB Share");
        KapowWrapper.share(this.text, 'facebook', function(){
            console.log('Fb Share successful');
        });
    }

    _handleTweetClick() {
        console.log("Tweet Share");
        KapowWrapper.share(this.text, 'twitter', function(){
            console.log('Tweet Share successful');
        });
    }
}

export default GameOver;

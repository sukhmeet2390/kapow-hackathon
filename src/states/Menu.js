"use strict";
class StartPlay extends Phaser.State {
    preload() {
        this.game.stage.backgroundColor = '#182d3b';
        this.game.load.image('button', 'assets/playGame.png');
    }

    create() {
        let button = this.game.add.button(this.game.world.centerX - 95, 400, 'button', this.actionOnClick, this, 2, 1, 0);
        //this.game.stage.addChild(button);
    }

    update() {

    }

    actionOnClick(){
        
        this.game.state.start("Lobby");
        //pubsub.publish('menu/playButtonClicked', [this]);
    }
    // shutdown() {
    //     console.log(this.stage.children);
    //     console.log("Shut down for Menu");
    //     console.log(this.stage.children);
    //     for (let i = this.game.stage.children.length - 1; i >= 0; i--) {
    //        //this.game.stage.children[i].destroy();
    //         this.game.stage.removeChild(this.game.stage.children[i]);
    //     }
    //     console.log("Shut down for Menu completed");
    // }

}

export default StartPlay;
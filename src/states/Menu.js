"use strict";
class StartPlay extends Phaser.State {
    preload() {
        this.game.stage.backgroundColor = '#182d3b';
        this.game.load.image('button', 'assets/playGame.png');
    }

    create() {
        let button = this.game.add.button(this.game.world.centerX - 95, 400, 'button', this.actionOnClick, this, 2, 1, 0);
        this.game.stage.addChild(button);
    }

    update() {

    }

    actionOnClick(){
        console.log("Clc");
        pubsub.publish('menu/playButtonClicked', [this]);
    }
}

export default StartPlay;
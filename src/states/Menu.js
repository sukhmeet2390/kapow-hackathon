"use strict";
class StartPlay extends Phaser.State {
    preload() {
    }

    create() {
        let button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.actionOnClick, this, 2, 1, 0);
        button.anchor.setTo(0.5);
    }

    update() {

    }

    actionOnClick(){
        this.game.state.start("Lobby");
    }

}

export default StartPlay;
"use strict";

class Menu extends Phaser.State {
    preload() {
        this.game.load.image('bg', 'assets/final/welcome.png');
        this.game.load.image('bt', 'assets/final/bt-play.png');
    }

    create() {
        let bg = this.game.add.image(0, 0, 'bg');
        let button = this.game.add.button(784, 782, 'bt', this.actionOnClick, this, 2, 1, 0);
    }

    _handleGameload(room) {
        if (room === null) {
            console.log("No Room Found");

        }
        else {

        }
    }

    update() {
    }

    actionOnClick() {
        this.game.state.start("Lobby");
    }

}

export default Menu;
"use strict";

class Menu extends Phaser.State {
    preload() {
    }

    create() {
        let button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.actionOnClick, this, 2, 1, 0);
        button.anchor.setTo(0.5);

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
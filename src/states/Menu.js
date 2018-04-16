"use strict";

class Menu extends Phaser.State {
    preload() {

    }

    create() {
        let bg = this.game.add.image(0, 0, 'welcome');
        let button = this.game.add.button(784, 782, 'bt', this.actionOnClick, this, 2, 1, 0);
    }

    _handleBackButton() {
        console.log("Back button inside Menu!");
        kapow.close();
    }

    update() {
    }

    actionOnClick() {
        this.game.state.start("Lobby");
    }

}

export default Menu;
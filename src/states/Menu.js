"use strict";

class Menu extends Phaser.State {
    preload() {
        this.game.load.image('bg', 'assets/final/welcome.png');
        this.game.load.image('bt', 'assets/bt-battle.png');
    }

    create() {
        let prem = this.game.add.image(0, 0, 'bg');
        prem.scale.setTo(0.23,0.25);



        let button = this.game.add.button(this.game.world.centerX,
            this.game.world.centerY+100, 'bt', this.actionOnClick, this, 2, 1, 0);
        button.anchor.setTo(0.5);


    }

    _handleGameload(room) {
        if (room === null) {
            console.log("No Room Found");

        }
        else {

        }
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
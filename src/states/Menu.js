"use strict";

class Menu extends Phaser.State {
    preload() {
        this.game.load.image('prem', 'assets/final/char-prem-standing.png');
        this.game.load.image('babuji', 'assets/final/char-babuji-standing.png');
        this.game.load.image('bt', 'assets/bt-battle.png');
    }

    create() {
        let prem = this.game.add.image(this.game.world.centerX - 900, this.game.world.centerY - 500, 'prem')
        prem.scale.setTo(3,3);

        let babu = this.game.add.image(this.game.world.centerX + 500, this.game.world.centerY - 500, 'babuji')
        babu.scale.setTo(3,3);


        let button = this.game.add.button(this.game.world.centerX,
            this.game.world.centerY+200, 'bt', this.actionOnClick, this, 2, 1, 0);
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
"use strict";

import kapowWrapper from "../kapow/KapowWrapper"

class Lobby extends Phaser.State {

    preload() {
        console.log("Lobby Preload");
        this.load.image("block1", "assets/lib/pinkBlock.png");
        this.load.image("block2", "assets/lib/blueBlock.png");
        this.load.image("arrowLeft", "assets/lib/arrow1.png");
        this.load.image("arrowRight", "assets/lib/arrow2.png");
        this.load.image("box", "assets/lib/box.png");
    }

    create() {
        console.log("Lobby create called!");
        this.createSlider();
        let button = this.game.add.button(this.game.world.centerX, 900, 'button', this.onClick, this, 2, 1, 0);
        button.anchor.setTo(0.5);
    }

    onClick() {
        console.log("Game started!");
        var self = this;
        kapowWrapper.startGameWithFriends(function() {
            console.log("Starting game with friends!");
            self.game.state.start("Arena");
        },
        function(error) {
            console.log(error);
        });
    }

    createSlider() {
        this.chosenPlayer = 0;

        this.sliderGroup = this.game.add.group();
        this.block1 = this.game.add.image(this.game.world.centerX, this.game.world.centerY, "block1");
        this.block1.anchor.setTo(0.5);
        this.sliderGroup.add(this.block1);
        this.block2 = this.game.add.image(this.game.world.centerX + 500, this.game.world.centerY, "block2");
        this.block2.anchor.setTo(0.5);
        this.sliderGroup.add(this.block2);

        let mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.anchor.setTo(0.5);
        mask.drawRect(this.game.world.centerX - 250, this.game.world.centerY - 200, 500, 400);
        this.sliderGroup.mask = mask;

        this.block1SwipeToLeft = this.game.add.tween(this.block1).to({x: this.game.world.centerX-500}, 600, "Quart.easeOut");
        this.block1SwipeToRight = this.game.add.tween(this.block1).to({x: this.game.world.centerX}, 600, "Quart.easeOut");
        this.block2SwipeToLeft = this.game.add.tween(this.block2).to({x: this.game.world.centerX}, 600, "Quart.easeOut");
        this.block2SwipeToRight = this.game.add.tween(this.block2).to({x: this.game.world.centerX+500}, 600, "Quart.easeOut");
    }

    _nextItem() {
        this.block1SwipeToRight.start();
        this.block2SwipeToRight.start();
        this.chosenPlayer = 1;
    }

    _prevItem() {
        this.block1SwipeToLeft.start();
        this.block2SwipeToLeft.start();
        this.chosenPlayer = 0;
    }

    update() {
    }
}

export default Lobby;
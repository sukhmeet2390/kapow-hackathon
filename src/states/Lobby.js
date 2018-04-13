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


        //
        this.slider = new phaseSlider(this.game);
    }

    create() {
        console.log("Lobby create called!");
        let button = this.game.add.button(this.game.world.centerX - 95, 400, 'button', this.onClick, this, 2, 1, 0);
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


    // create() {
    //     console.log("Lobby create");
    //     this.game.stage.backgroundColor = 0xcdcdcd;
    //     this.add.image(0, 0, "bg");
    //     this.sliderGroup = this.game.add.group();
    //     this.game.stage.addChild(this.sliderGroup);
    //     console.log(this.stage.children);
    //     this.block1 = this.game.add.image(this.game.world.centerX, this.game.world.centerY, "block1");
    //     this.block1.anchor.setTo(0.5);
    //     this.sliderGroup.add(this.block1);
    //     // this.game.stage.addChild(this.block1);
    //     this.block2 = this.game.add.image(this.game.world.centerX + 500, this.game.world.centerY, "block2");
    //     this.block2.anchor.setTo(0.5);
    //     this.sliderGroup.add(this.block2);

    //     let mask = this.game.add.graphics(0, 0);
    //     mask.beginFill(0xffffff);
    //     mask.anchor.setTo(0.5);
    //     mask.drawRect(this.game.world.centerX-250, this.game.world.centerY-200, 500, 400);
    //     // mask.anchor.setTo(0.5);
    //     this.sliderGroup.mask = mask;
    //     this.tapStart = 0;
    //     this.tapEnd = 0;
    //     this.game.input.onDown.add(this._tap, this);
    //     this.game.input.onUp.add(this._release, this);
    //     this.block1SwipeToLeft = this.game.add.tween(this.block1).to({x: this.game.world.centerX-500}, 600, "Quart.easeOut");
    //     this.block1SwipeToRight = this.game.add.tween(this.block1).to({x: this.game.world.centerX}, 600, "Quart.easeOut");
    //     this.block2SwipeToLeft = this.game.add.tween(this.block2).to({x: this.game.world.centerX}, 600, "Quart.easeOut");
    //     this.block2SwipeToRight = this.game.add.tween(this.block2).to({x: this.game.world.centerX+500}, 600, "Quart.easeOut");
    //     // this.game.stage.addChild(this.block2);

    //     // this.block3 = this.game.add.image(600, 200, "box");
    //     // this.game.stage.addChild(this.block3);

    //     // this.slider.createSlider({
    //     //     customSliderBG: false,
    //     //     mode: "horizontal",
    //     //     sliderBGAlpha: 0.8,
    //     //     x: this.game.world.centerX,
    //     //     y: this.game.world.centerY,
    //     //     objects: [this.block1, this.block2]
    //     // });
    //     // this.slider.showSlider();
    //     console.log(this.stage.children);
    // }

    _tap() {
        this.tapStart = this.game.input.x;
    }

    _release() {
        this.tapEnd = this.game.input.x;
        if (this.tapEnd > this.tapStart) {
            console.log("right");
            this.block1SwipeToRight.start();
            this.block2SwipeToRight.start();
        }
        else if (this.tapEnd < this.tapStart) {
            console.log("left");
            this.block1SwipeToLeft.start();
            this.block2SwipeToLeft.start();
        }
    }

    update() {
    }
}

export default Lobby;
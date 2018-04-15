"use strict";

import kapowWrapper from "../kapow/KapowWrapper"
import CharacterChosen from "../model/CharacterChosen";
import MoveData from "../model/MoveData";
import * as PhaserUi from "phaser-ui";

class Lobby extends Phaser.State {
    someFunc(){


    }

    preload() {
        console.log("Lobby Preload");
        this.load.image("block1", "assets/final/lobby_prem.png");
        this.load.image("block2", "assets/final/lobby_babuji.png");
        this.load.image("play", "assets/bt-battle.png");
        this.slider = new phaseSlider(this.game);
    }

    sendChoices(chosenCharacter) {
        var self = this;
        kapowWrapper.getUserInfo(function(user) {
            var chooserId = user.player.id;
            var characterChosen = new CharacterChosen(chosenCharacter, chooserId);
            kapowWrapper.getRoomInfo(function(room) {
                var opponentId = null;
                for (var i = 0; i < 2; i++) {
                    if (room.players[i].id !== chooserId) {
                        opponentId = room.players[i].id;
                    }
                }

                console.log("Chooser : " + chooserId);
                console.log("Character chosen : " + characterChosen);

                kapowWrapper.callOnServer('initialiseRoom', chooserId, function() {
                    console.log("Room init called!");
                    kapowWrapper.callOnServer('sendData', new MoveData(characterChosen, chooserId, opponentId),
                        function() {
                            console.log("Character choose turn sent!");
                            self.game.state.start("Arena");
                        });
                }, function(error) {
                    console.log("Error in room init : " + error);
                });
            });
        });
    }

    create() {
        let block1 = this.game.add.image(0, 0, "block1");
        block1.scale.setTo(0.23,0.25);
        let block2 = this.game.add.image(0, 0, "block2");
        block2.scale.setTo(0.23,0.25);

        this.slider.createSlider({
            customSliderBG: false,
            mode: "horizontal",
            sliderBGAlpha: 0.5,
            width: this.game.width,
            height: this.game.height,
            x: 0,
            y: 0,
            objects: [block1, block2]
        });
        this.slider.removeItemAt(0);
        console.log(this.slider);


        var btn = this.game.add.image(670, 892, "play");
        btn.inputEnabled = true;

        var self = this;
        btn.events.onInputDown.addOnce(function (e, pointer) {
            var index = self.slider.getCurrentIndex();
            console.log("Selected char ", index);
            self.onClick(index);
        })
    }
    onClick(index) {
        console.log("Play with friends clicked!");
        var self = this;
        kapowWrapper.startGameWithFriends(function () {
                console.log("Starting game with friends!");
                self.sendChoices(index);
            },
            function (error) {
                console.log(error);
            });
    }

    update() {
    }
}

export default Lobby;
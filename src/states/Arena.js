import kapowWrapper from "../kapow/KapowWrapper";
import HistoryWrapper from "../kapow/HistoryWrapper";
import Move from "../model/Move";
import MoveData from "../model/MoveData";
import * as PhaserUi from "phaser-ui";
import Tom from "../model/Toms";
import Harry from "../model/Harry";
import SyncState from "../model/SyncState";
import Health from "../model/Health";

class Arena extends Phaser.State {

    preload() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
        this.game.physics.arcade.gravity.x = 0;
    }

    create() {
        console.log("Create of arena called!");
        this.game.add.image(0, 0, 'bg');
        this.game.sound.stopAll();

        let style = { font: "bold 90px Arial", fill: "#FFFFFF"};
        this.windText = this.game.add.text(this.game.world.centerX, 150, '', style);
        this.windText.anchor.setTo(0.5);

        var self = this;
        kapowWrapper.getRoomInfo(function (room) {
            console.log("Room fetched : " + room);
            if (!room) {
                self.game.state.start("Menu");
            } else {
                self.checkGameState();
            }
        });
    }

    checkGameState() {
        let self = this;
        HistoryWrapper.getOutcome(function (message) {
            if (message) {
                console.log("Game already ended in room!");
                kapowWrapper.getUserInfo(function (owner) {
                    var myId = owner.player.id;
                    console.log(JSON.stringify(message) + " " + JSON.stringify(owner));
                    if (message.data.ranks[myId] === 1) {
                        self.game.state.start("GameOver", true, false, "Win");
                    } else if (message.data.ranks[myId] === 2) {
                        self.game.state.start("GameOver", true, false, "Lose");
                    } else {
                        self.game.state.start("GameOver", true, false, null);
                    }
                });

            } else {
                self.createState();
            }
        });
    }

    createState() {
        this.health1 = new PhaserUi.ProgressBar(this.game, 730, 70, PhaserUi.Graphics.roundedRectBmd, 4, '');
        this.health2 = new PhaserUi.ProgressBar(this.game, 730, 70, PhaserUi.Graphics.roundedRectBmd, 4, '');
        this.health1.x = 400;
        this.health1.y = 100;
        this.health1.progress = 1;

        this.health2.x = 1500;
        this.health2.y = 100;
        this.health2.progress = 1;
        this.health2.reversed = true;

        this.wall = this.game.add.sprite(910, 600, 'wall');
        this.game.physics.enable([this.wall], Phaser.Physics.ARCADE);
        this.wall.body.allowGravity = false;
        this.wall.body.immovable = true;

        this.initialise();
    }

    update() {
        var self = this;

        this.displayWind();

        if (this.firstPlayerWeapon && this.secondPlayerSilhouette) {
            this.game.physics.arcade.collide(this.firstPlayerWeapon, this.secondPlayerSilhouette, function (weapon, player) {
                console.log("You hit opponent!");
                weapon.destroy();
                self._handleHit(self.firstPlayerSilhouette, self.firstPlayerWeapon, self.secondPlayerSilhouette, null, true);
            });
        }

        if (this.secondPlayerWeapon && this.firstPlayerSilhouette) {
            this.game.physics.arcade.collide(this.secondPlayerWeapon, this.firstPlayerSilhouette, function (weapon, player) {
                console.log("Opponent hit me!");
                weapon.destroy();
                self._handleHit(self.secondPlayerSilhouette, self.secondPlayerWeapon, self.firstPlayerSilhouette, null, false);
            });
        }

        if (this.firstPlayerWeapon && this.wall) {
            this.game.physics.arcade.collide(this.firstPlayerWeapon, this.wall, function (weapon, wall) {
                console.log("Hit wall");
                weapon.destroy();
                self._handleHit(self.firstPlayerSilhouette, self.firstPlayerWeapon, null, true, true);
            });
        }

        if (this.secondPlayerWeapon && this.wall) {
            this.game.physics.arcade.collide(this.secondPlayerWeapon, this.wall, function (weapon, wall) {
                console.log("Hit wall");
                weapon.destroy();
                self._handleHit(self.secondPlayerSilhouette, self.secondPlayerWeapon, null, true, false);
            });
        }
    }

    _handleHit(hitBy, hitWeapon, hitTo, isWall, isFirstPlayer) {
        var self = this;
        if (isWall) {
            console.log("You hit the wall");
        } else {
            hitBy.playSuccess();
            hitTo.playerHit();
            console.log("Player hit the other one ");
            if (isFirstPlayer) {
                this.updateHealth2(0.25);
            } else {
                this.updateHealth1(0.25);
            }
        }

        if (isFirstPlayer) {
            this.sendSyncState();
        } else {
            this.setTurn();
        }
    }

    initialise() {
        var self = this;
        kapowWrapper.getUserInfo(function (user) {
            console.log("Found userInfo ", user, self);
            self.playerID = user.player.id;
            self.owner = user.player;
            kapowWrapper.getRoomInfo(function (room) {
                console.log("Found room info ", room);
                for (var i = 0; i < 2; i++) {
                    if (room.players[i].id !== self.playerID) {
                        self.opponentID = room.players[i].id;
                    }
                }
                console.log("UserJID : " + self.playerID);
                console.log("opponentJID : " + self.opponentID);

                self.getPlayers();
                self.setTurn();

            });
        });
    }

    getPlayers() {
        var self = this;
        HistoryWrapper.getChoice(self.playerID, function (message) {
            if (!message) {
                HistoryWrapper.getChoice(self.opponentID, function (message) {
                    var opponentChoice = message.data.characterId;
                    self.respectChoices(1 - opponentChoice, opponentChoice);
                });
            } else {
                var myChoice = message.data.characterId;
                self.respectChoices(myChoice, 1 - myChoice);
            }
        });
    }

    respectChoices(myChoice, opponentChoice) {
        console.log("My choice : " + myChoice);
        console.log("Opponent choice : " + opponentChoice);
        this.myChoice = myChoice;
        this.opponentChoice = opponentChoice;

        var self = this;

        HistoryWrapper.getLastSyncState(function(message) {

            if (myChoice === 0) {
                self.secondPlayerSilhouette = new Tom(self.game, 1629, 690, self.opponentID);
                self.firstPlayerSilhouette = new Harry(self.game, 80, 690, self.playerID);

            } else {
                self.secondPlayerSilhouette = new Harry(self.game, 1629, 690, self.opponentID);
                self.firstPlayerSilhouette = new Tom(self.game, 80, 690, self.playerID);
            }

            if (message) {
                let p1 = message.data.tom;
                let p2 = message.data.harry;
                console.log("p1 = " + JSON.stringify(p1));
                console.log("p1 = " + JSON.stringify(p2));
                if (p1.jid === self.firstPlayerSilhouette.player.jid) {
                    self.firstPlayerSilhouette.player.health.value = p1.health.value;
                    self.secondPlayerSilhouette.player.health.value = p2.health.value;
                } else {
                    self.firstPlayerSilhouette.player.health.value = p2.health.value;
                    self.secondPlayerSilhouette.player.health.value = p1.health.value;
                }
            }

            self.health1.progress = self.firstPlayerSilhouette.player.health.value;
            self.health2.progress = self.secondPlayerSilhouette.player.health.value;

            console.log(self.health1.progress + " " + self.health2.progress);

            console.log(self.firstPlayerSilhouette);
            console.log(self.secondPlayerSilhouette);

            self.game.physics.enable([self.firstPlayerSilhouette, self.secondPlayerSilhouette], Phaser.Physics.ARCADE);

            self.secondPlayerSilhouette.body.allowGravity = false;
            self.firstPlayerSilhouette.body.allowGravity = false;

            self.firstPlayerSilhouette.body.immovable = true;
            self.secondPlayerSilhouette.body.immovable = true;

            HistoryWrapper.getHeartMessage(self.playerID, function (message) {
                if (!message) {
                    self.firstPlayerSilhouette.showHealthMove(self);
                }
            });

        });
    }

    sendHealthMove() {
        let self = this;
        let healthMove = new Heart(this.playerID);
        this.firstPlayerSilhouette.removeHealthButton();
        console.log("Sending heart move : " + healthMove);
        kapowWrapper.callOnServer('sendTurn', new MoveData(healthMove, this.playerID, this.playerID), function() {
            let change = Math.min(1 - self.health1.progress, 0.5);
            self.updateHealth1(-change);
            self.sendSyncState();
        });
    }

    addFacebookAvatars() {
        console.log("Adding facebook images");
        var self = this;

        kapowWrapper.getRoomInfo(function (room) {
            var players = room.players;
            for (var i = 0; i < 2; i++) {
                self.game.load.image("avatar_" + players[i].id, players[i].profileImage + "?height=100&width=100");
            }
            self.game.load.start();
            self.game.load.onLoadComplete.add(function () {
                let myImage = self.game.add.sprite(750, 50, "avatar_" + self.playerID);
                let oppImage = self.game.add.sprite(1050, 50, "avatar_" + self.opponentID);
                console.log(myImage);
                console.log(oppImage);

            }, self);
        });
    }

    updateArena() {
    }

    sendMove(power, angle, wind) {
        console.log("calling sendMove");
        this.firstPlayerWeaponTransparent.kill();
        let move = new Move(this.firstPlayerSilhouette.player, this.secondPlayerSilhouette.player, power, angle, wind, this.playerID);
        let moveData = new MoveData(move, this.playerID, this.playerID);
        let self = this;
        kapowWrapper.callOnServer('sendTurn', moveData, function () {
            console.log("Send turn success");
            self.playMove(self.firstPlayerWeapon, power, angle, wind);
        });
    }

    opponentMove(moveMessage) {
        if (moveMessage.data.angle >= 0) {
            moveMessage.data.angle = 180 - moveMessage.data.angle;
        } else {
            moveMessage.data.angle = -180 - moveMessage.data.angle;
        }
        this.playMove(this.secondPlayerWeapon, moveMessage.data.power, moveMessage.data.angle, moveMessage.data.wind * -1);
    }

    opponentHealthMove(message) {
        let self = this;
        if (message.data.type === "HeartMove" && message.data.sentBy === this.playerID) {
            console.log("Opponent used a heart move!");
            let change = Math.min(1 - self.health2.progress, 0.5);
            self.updateHealth2(-change);
        }
    }

    playMove(weapon, power, angle, wind) {
        console.log("Emulating move : ", angle, power, wind, weapon.body.velocity);
        weapon.body.allowGravity = true;
        this.game.physics.arcade.gravity.x = wind;
        this.game.physics.arcade.velocityFromAngle(angle, power, weapon.body.velocity);
    }

    enableTurn() {
        this.killAllWeapons();
        if (this.winner) return;
        this.game.physics.arcade.gravity.x = this.getRandomWind();
        this.firstPlayerWeapon = this.game.add.sprite(300, 600, 'projectile');
        this.firstPlayerWeaponTransparent = this.game.add.sprite(300, 600, 'projectile');
        this.game.physics.enable([this.firstPlayerWeapon], Phaser.Physics.ARCADE);
        this.firstPlayerWeapon.body.allowGravity = false;
        this.firstPlayerWeaponTransparent.inputEnabled = true;
        this.firstPlayerWeaponTransparent.alpha = 0.4;
        this.firstPlayerWeaponTransparent.input.enableDrag(true);
        this.firstPlayerWeapon.checkWorldBounds = true;
        this.firstPlayerWeaponTransparent.events.onDragStop.add(this.dragFinished, this, 0, this.firstPlayerWeapon);
        this.firstPlayerWeapon.events.onOutOfBounds.add(this.finishAnimation, this, 0, this.firstPlayerWeapon);
        if (this.firstPlayerSilhouette && this.firstPlayerSilhouette.player.name === "Tom") {
            console.log("Changing textur tom to loaded");
            this.firstPlayerSilhouette.loadTexture('babuji-loaded', 1, true);
        } else if (this.firstPlayerSilhouette && this.firstPlayerSilhouette.player.name === "Harry") {
            console.log("Changing textur harry to loaded");
            this.firstPlayerSilhouette.loadTexture('prem-loaded', 1, true);
        } else {
            console.log("Neither tom or harry " + this.firstPlayerSilhouette);
        }
    }

    displayWind() {
        let wind = this.game.physics.arcade.gravity.x;
        if (wind && wind > 0) {
            let times = (wind + 59) / 60;
            let windString = "";
            while (times > 0) {
                windString += "-";
                times -= 1;
            }
            windString += ">";
            this.windText.text = windString;
            this.windText.visible = true;
        } else {
            this.windText.visible = false;
        }
    }

    getRandomWind() {
        return Math.floor(Math.random() * 300);
    }

    finishAnimation(weapon) {
        console.log("Animation finished!");
        if (weapon && weapon === this.firstPlayerWeapon) {
            this.sendSyncState();
        } else {
            this.setTurn();
        }
        this.killWeapon(weapon);
    }

    sendSyncState() {
        var self = this;
        let syncState = new SyncState(this.firstPlayerSilhouette.player, this.secondPlayerSilhouette.player);
        console.log("Sync state : " + JSON.stringify(syncState));
        kapowWrapper.callOnServer('sendTurn', new MoveData(syncState, this.playerID, this.opponentID), function() {
            console.log("Sync state sent successfully!");
            self.disableTurn();
        });
    }

    disableTurn() {
        this.game.physics.arcade.gravity.x = 0;
        this.killAllWeapons();
        if (this.winner) return;
        this.secondPlayerWeapon = this.game.add.sprite(1500, 600, 'projectile');
        this.secondPlayerWeapon.checkWorldBounds = true;
        this.secondPlayerWeapon.events.onOutOfBounds.add(this.finishAnimation, this, 0, this.secondPlayerWeapon);
        this.game.physics.enable([this.secondPlayerWeapon], Phaser.Physics.ARCADE);
        this.secondPlayerWeapon.body.allowGravity = false;
    }

    killAllWeapons() {
        this.killWeapon(this.firstPlayerWeapon);
        this.killWeapon(this.firstPlayerWeaponTransparent);
        this.killWeapon(this.secondPlayerWeapon);
    }

    killWeapon(weapon) {
        weapon && weapon.destroy();
    }

    turnChange(player) {
        if (player.id === this.playerID) {
            this.enableTurn();
        } else {
            this.disableTurn();
        }
    }

    setTurn() {
        if (this.winner) {
            this.killAllWeapons();
            return;
        }
        let self = this;
        kapowWrapper.getRoomInfo(function (room) {
            self.room = room;
            if (room.players[0].affiliation === "accepted" && room.players[1].affiliation === "accepted") {
                if (!room.nextPlayerId) {
                    console.log("No next player set");
                }
                else if (room.nextPlayerId === self.playerID) {
                    self.enableTurn();
                } else {
                    self.disableTurn();
                }
            }
        });
    }

    endGame(message) {
        console.log("End game called : " + JSON.stringify(message));
        let self = this;
        if (this.winner === this.firstPlayerSilhouette) {
            let winnerId = this.firstPlayerSilhouette.player.jid;
            let loserId = this.secondPlayerSilhouette.player.jid;
            console.log("Winner", winnerId);
            console.log("loser", loserId);
            kapowWrapper.callOnServer('endGameOnServer', loserId, function () {
                console.log("Ranks success");
                self.game.state.start("GameOver", true, false, "Win");
            });
        } else {
            this.game.state.start("GameOver", true, false, "Lose");
        }
    }

    dragFinished(draggedObject, pointer, initialObject) {
        let power = this.getDistance(initialObject.position, draggedObject.position);
        let angle = this.getAngle(initialObject.position, draggedObject.position);
        console.log("Power : " + power + " and Angle : " + angle);
        this.killWeapon(this.firstPlayerWeaponTransparent);
        this.sendMove(power, angle, this.game.physics.arcade.gravity.x);
    }

    getAngle(initialPosition, finalPosition) {
        let dx = finalPosition.x - initialPosition.x;
        let dy = finalPosition.y - initialPosition.y;
        let radianAngle = Math.atan2(-dy, -dx);
        return this.radianToDegree(radianAngle);
    }

    radianToDegree(radians) {
        let degree = (180 * radians / Math.PI);
        return degree;
    }

    getDistance(initialPosition, finalPosition) {
        let dx = finalPosition.x - initialPosition.x;
        let dy = finalPosition.y - initialPosition.y;
        return 2 * Math.sqrt(dx * dx + dy * dy);
    }

    updateHealth1(value) {
        let progress = this.health1.progress;
        this.health1.progress = progress - value;
        this.firstPlayerSilhouette.player.health.value = progress - value;
        if (this.health1.progress < 0.1) {
            console.log('U die', this.health1.progress);
            this.winner = this.secondPlayerSilhouette;
            this.endGame();

        }
    }

    updateHealth2(value) {
        let progress = this.health2.progress;
        this.health2.progress = progress - value;
        this.secondPlayerSilhouette.player.health.value = progress - value;
        if (this.health2.progress < 0.1) {
            console.log('U die', this.health2.progress);
            this.winner = this.firstPlayerSilhouette;
            this.endGame();
        }
    }

    _handleBackButton() {
        console.log("Back button inside arena!");
        kapow.unloadRoom(function () {
            console.log("Unloaded room");
            kapow.close();
        });
    }
}

export default Arena;
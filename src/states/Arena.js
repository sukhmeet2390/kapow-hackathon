import kapowWrapper from "../kapow/KapowWrapper";
import HistoryWrapper from "../kapow/HistoryWrapper";
import Move from "../model/Move";
import MoveData from "../model/MoveData";
import * as PhaserUi from "phaser-ui";
import Tom from "../model/Toms";
import Harry from "../model/Harry";

class Arena extends Phaser.State {

    preload() {
        this.game.load.image('tom', 'assets/final/char-babuji-standing.png');
        this.game.load.image('harry', 'assets/final/char-prem-standing.png');
        this.game.load.image('wall', 'assets/wall.png');
        this.game.load.image('projectile', 'assets/final/projectile-bullet.png');
        this.game.load.crossOrigin = "anonymous";

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
    }

    create() {
        console.log("Create of arena called!");
        var self = this;
        kapowWrapper.getRoomInfo(function(room) {
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
        HistoryWrapper.getOutcome(function(message) {
            if (message) {
                console.log("Game already ended in room!");
                self.game.state.start("GameOver");
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

        if (isWall) {
            console.log("You hit the wall");
        } else {
            console.log("Player hit the other one ");
            if (isFirstPlayer) {
                this.updateHealth2(0.2)
            } else {
                this.updateHealth1(0.2);
            }
        }

        this.setTurn();
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
                console.log(self);
                console.log("UserJID : " + self.playerID);
                console.log("opponentJID : " + self.opponentID);
                self.getPlayers();
                self.setTurn();

            });
        });
    }

    getPlayers() {
        var self = this;
        HistoryWrapper.getChoice(self.playerID, function(message) {
            console.log(JSON.stringify(message) + " " + self.playerID);
            if (!message) {
                HistoryWrapper.getChoice(self.opponentID, function(message) {
                    console.log(JSON.stringify(message) + " " + self.opponentID);
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

        if (myChoice === 0) {
            this.secondPlayerSilhouette = new Tom(this.game, 1629, 690, 'tom', this.opponentID);
            this.firstPlayerSilhouette = new Harry(this.game, 80, 690, 'harry', this.playerID);
        } else {
            this.secondPlayerSilhouette = new Harry(this.game, 1629, 690, 'harry', this.opponentID);
            this.firstPlayerSilhouette = new Tom(this.game, 80, 690, 'tom', this.playerID);
        }

        console.log(this.firstPlayerSilhouette);
        console.log(this.secondPlayerSilhouette);
        this.game.physics.enable([this.firstPlayerSilhouette, this.secondPlayerSilhouette], Phaser.Physics.ARCADE);

        this.secondPlayerSilhouette.body.allowGravity = false;
        this.firstPlayerSilhouette.body.allowGravity = false;

        this.firstPlayerSilhouette.body.immovable = true;
        this.secondPlayerSilhouette.body.immovable = true;

        // this.addFacebookAvatars();
    }

    addFacebookAvatars() {
        console.log("Adding facebook images");
        var self = this;

        kapowWrapper.getRoomInfo(function(room) {
            var players = room.players;
            for (var i = 0; i < 2; i++) {
                self.game.load.image("avatar_" + players[i].id, players[i].profileImage + "?height=100&width=100");
            }
            self.game.load.start();
            self.game.load.onLoadComplete.add(function() {
                self.myImage = self.game.add.sprite(750, 50, "avatar_" + self.playerID);
                self.oppImage = self.game.add.sprite(1050, 50, "avatar_" + self.opponentID);
                console.log(self.myImage);
                console.log(self.oppImage);
            }, self);
        });
    }

    updateArena() {
    }

    sendMove(power, angle) {
        console.log("calling sendMove");
        this.firstPlayerWeaponTransparent.kill();
        let move = new Move(this.owner, this.opponentPlayer, power, angle, this.playerID);
        let moveData = new MoveData(move, this.playerID, this.opponentID);
        let self = this;
        kapowWrapper.callOnServer('sendTurn', moveData, function () {
            console.log("Send turn success");
            self.playMove(self.firstPlayerWeapon, power, angle);
        });
    }

    opponentMove(moveMessage) {
        if (moveMessage.data.angle >= 0) {
            moveMessage.data.angle = 180 - moveMessage.data.angle;
        } else {
            moveMessage.data.angle = -180 - moveMessage.data.angle;
        }
        this.playMove(this.secondPlayerWeapon, moveMessage.data.power, moveMessage.data.angle);
    }

    playMove(weapon, power, angle) {
        console.log("Emulating move : ", this.game, angle, power, weapon.body.velocity);
        weapon.body.allowGravity = true;
        this.game.physics.arcade.velocityFromAngle(angle, power, weapon.body.velocity);
    }

    enableTurn() {
        this.killAllWeapons();
        this.firstPlayerWeapon = this.game.add.sprite(300, 600, 'projectile');
        this.firstPlayerWeaponTransparent = this.game.add.sprite(300, 600, 'projectile');
        this.game.physics.enable([this.firstPlayerWeapon, this.firstPlayerWeaponTransparent], Phaser.Physics.ARCADE);
        this.firstPlayerWeaponTransparent.body.allowGravity = false;
        this.firstPlayerWeapon.body.allowGravity = false;
        this.firstPlayerWeaponTransparent.inputEnabled = true;
        this.firstPlayerWeaponTransparent.alpha = 0.4;
        this.firstPlayerWeaponTransparent.input.enableDrag(true);
        this.firstPlayerWeapon.checkWorldBounds = true;
        this.firstPlayerWeaponTransparent.events.onDragStop.add(this.dragFinished, this, 0, this.firstPlayerWeapon);
        this.firstPlayerWeapon.events.onOutOfBounds.add(this.finishAnimation, this, 0, this.firstPlayerWeapon);
    }

    finishAnimation(weapon) {
        console.log("Animation finished!");
        this.killWeapon(weapon);
        this.setTurn();
    }

    disableTurn() {
        this.killAllWeapons();
        this.secondPlayerWeapon = this.game.add.sprite(1500, 600, 'projectile');
        this.secondPlayerWeapon.checkWorldBounds = true;
        this.secondPlayerWeapon.events.onOutOfBounds.add(this.finishAnimation, this, 0, this.secondPlayerWeapon);
        this.game.physics.enable([this.secondPlayerWeapon], Phaser.Physics.ARCADE);
        this.secondPlayerWeapon.body.allowGravity = false;
    }

    killAllWeapons() {
        // this.killWeapon(this.firstPlayerWeapon);
        // this.killWeapon(this.firstPlayerWeaponTransparent);
        // this.killWeapon(this.secondPlayerWeapon);
    }

    killWeapon(weapon) {
        weapon && weapon.destroy();
    }

    setTurn() {
        let self = this;
        kapowWrapper.getRoomInfo(function (room) {
            self.room = room;
            if (room.players[0].affiliation == "accepted" && room.players[1].affiliation == "accepted") {
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
                self.game.state.start("GameOver");
            });
        } else {
            this.game.state.start("GameOver");
        }

    }

    dragFinished(draggedObject, pointer, initialObject) {
        let power = this.getDistance(initialObject.position, draggedObject.position);
        let angle = this.getAngle(initialObject.position, draggedObject.position);
        console.log("Power : " + power + " and Angle : " + angle);
        this.killWeapon(this.firstPlayerWeaponTransparent);
        this.sendMove(power, angle);
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
        this.firstPlayerSilhouette.player.health = progress - value;
        if (this.health1.progress < 0.1) {
            console.log('U die', this.health1.progress);
            this.winner = this.secondPlayerSilhouette;
            this.endGame();

        }
    }

    updateHealth2(value) {
        let progress = this.health2.progress;
        this.health2.progress = progress - value;
        this.secondPlayerSilhouette.player.health = progress - value;
        if (this.health2.progress < 0.1) {
            console.log('U die', this.health2.progress);
            this.winner = this.firstPlayerSilhouette;
            this.endGame();
        }
    }
}

export default Arena;
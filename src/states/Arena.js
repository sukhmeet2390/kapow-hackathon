import kapowWrapper from "../kapow/KapowWrapper";
import HistoryWrapper from "../kapow/HistoryWrapper";
import Move from "../model/Move";
import MoveData from "../model/MoveData";
import * as PhaserUi from "phaser-ui";

class Arena extends Phaser.State {

    preload() {
        this.game.load.image('tom', 'assets/tom.png');
        this.game.load.image('harry', 'assets/harry.png');
        this.game.load.image('wall', 'assets/wall.png');
        this.game.load.image('projectile', 'assets/projectile.png');

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
    }

    create() {
        this.health1 = new PhaserUi.ProgressBar(this.game, 730, 70, PhaserUi.Graphics.roundedRectBmd, 4, '');
        this.health2 = new PhaserUi.ProgressBar(this.game, 730, 70, PhaserUi.Graphics.roundedRectBmd, 4, '');
        this.health1.x = 400;
        this.health1.y = 100;
        this.health1.progress = 1;

        this.health2.x = 1500;
        this.health2.y = 100;
        this.health2.progress = 1;

        this.wall = this.game.add.sprite(910, 600, 'wall');

        this.addPlayers();
    }

    addPlayers() {
        this.secondPlayerSilhouette = this.game.add.sprite(1629, 690, 'tom');
        this.firstPlayerSilhouette = this.game.add.sprite(80, 690, 'harry');
        this.game.physics.enable([this.firstPlayerSilhouette, this.secondPlayerSilhouette], Phaser.Physics.ARCADE);

        this.secondPlayerSilhouette.body.allowGravity = false;
        this.firstPlayerSilhouette.body.allowGravity = false;

        this.firstPlayerSilhouette.body.immovable = true;
        this.secondPlayerSilhouette.body.immovable = true;
        this.initialise();

    }

    update() {
        var self = this;
        this.game.physics.arcade.collide(this.firstPlayerWeapon, this.secondPlayerSilhouette, function (weapon, player) {
            weapon.kill();
            console.log("You hit opponent!");
            self._handleHit(self.firstPlayerSilhouette, self.firstPlayerWeapon, self.secondPlayerSilhouette, null);
        });

        this.game.physics.arcade.collide(this.secondPlayerWeapon, this.firstPlayerSilhouette, function (weapon, player) {
            weapon.kill();
            console.log("Opponent hit me!");
            self._handleHit(self.secondPlayerSilhouette, self.secondPlayerWeapon, self.firstPlayerSilhouette, null);
        });
        this.game.physics.arcade.collide(this.firstPlayerWeapon, this.wall, function (weapon, player) {
            console.log("Hit wall");
            weapon.kill();
            self._handleHit(self.firstPlayerSilhouette, self.firstPlayerWeapon, null, true);
        })
        this.game.physics.arcade.collide(this.secondPlayerWeapon, this.wall, function (weapon, player) {
            console.log("Hit wall");
            weapon.kill();
            self._handleHit(self.secondPlayerSilhouette, self.secondPlayerWeapon, null, true);
        })
    }

    _handleHit(hitBy, hitWeapon, hitTo, isWall) {
        if (isWall) {
            console.log("You hit the wall");
        } else {
            console.log("Player " + hitBy + " hit using " + hitWeapon + " and hitted " + hitTo);
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
                console.log(self);
                console.log("UserJID : " + self.playerID);
                console.log("opponentJID : " + self.opponentID);
                self.getPlayers();
                self.setTurn();
            });
        });
    }

    getPlayers() {
        // var opponentChoice = HistoryWrapper.getChoice(this.opponentID);
        // var myChoice = HistoryWrapper.getChoice(this.playerID);
        //
        // if (myChoice == null) {
        //     myChoice = 1 - opponentChoice;
        //     this.sendChoice(myChoice);
        // }
        //
        // if (opponentChoice == null) {
        //     this.opponentChoice = 1 - myChoice;
        // }

        // get characters stored
    }

    sendChoice(choice) {
        kapowWrapper.callOnServer('sendData', new MoveData(choice, this.playerID, this.opponentID),
            function () {
                console.log("Character choose turn sent!");
            });
    }

    updateArena() {
    }

    sendMove(power, angle) {
        console.log("calling sendMove");
        this.firstPlayerWeaponTransparent.kill();
        let move = new Move(this.owner, this.opponentPlayer, power, angle, this.playerID);
        let moveData = new MoveData(move, this.playerID, this.opponentID);
        kapowWrapper.callOnServer('sendTurn', moveData, function(){
            console.log("Send turn success");
        });
        this.playMove(this.firstPlayerWeapon, power, angle);
        this.disableTurn();
    }

    opponentMove(moveMessage) {
        this.playMove(this.secondPlayerWeapon, moveMessage.data.power, moveMessage.data.angle);
        this.enableTurn();
    }

    playMove(weapon, power, angle) {
        console.log("Emulating move");
        this.game.physics.arcade.velocityFromAngle(angle, power, weapon.body.velocity);
        weapon.body.allowGravity = true;
    }

    enableTurn() {
        this.firstPlayerWeapon = this.game.add.sprite(300, 600, 'projectile');
        this.firstPlayerWeaponTransparent = this.game.add.sprite(300, 600, 'projectile');
        this.game.physics.enable([this.firstPlayerWeapon, this.firstPlayerWeaponTransparent], Phaser.Physics.ARCADE);
        this.firstPlayerWeaponTransparent.body.allowGravity = false;
        this.firstPlayerWeapon.body.allowGravity = false;
        this.firstPlayerWeaponTransparent.inputEnabled = true;
        this.firstPlayerWeaponTransparent.alpha = 0.4;
        this.firstPlayerWeaponTransparent.input.enableDrag(true);
        this.firstPlayerWeaponTransparent.events.onDragStop.add(this.dragFinished, this, 0, this.firstPlayerWeapon);
    }

    disableTurn() {
        this.secondPlayerWeapon = this.game.add.sprite(1500, 600, 'projectile');
        this.game.physics.enable([this.secondPlayerWeapon], Phaser.Physics.ARCADE);
        this.secondPlayerWeapon.body.allowGravity = false;
    }

    setTurn() {
        var self = this;
        kapowWrapper.getRoomInfo(function (room) {
            if (room.nextPlayerId === self.playerID) {
                self.enableTurn();
            } else {
                self.disableTurn();
            }
        });
    }

    turnChange(player) {
        console.log("Turn change received in arena : " + JSON.stringify(player));
        if (player === this.playerID) {
            this.enableTurn();
        } else {
            this.disableTurn();
        }
    }

    endGame(message) {
        console.log("End game called : " + JSON.stringify(message));
        this.game.state.start("GameOver");
    }

    dragFinished(draggedObject, pointer, initialObject) {
        let power = this.getDistance(initialObject.position, draggedObject.position);
        let angle = this.getAngle(initialObject.position, draggedObject.position);
        console.log("Power : " + power + " and Angle : " + angle);
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
        if (this.health1.progress < 0.1) {
            console.log('U die', this.health1.progress);
        }
    }

    updateHealth2(value) {
        let progress = this.health2.progress;
        this.health2.progress = progress - value;
        if (this.health2.progress < 0.1) {
            console.log('U die', this.health2.progress);
        }
    }
}

export default Arena;
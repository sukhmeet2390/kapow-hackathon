import kapowWrapper from "../kapow/KapowWrapper";
import HistoryWrapper from "../kapow/HistoryWrapper";
import Move from "../model/Move";
import MoveData from "../model/MoveData";

class Arena extends Phaser.State {

    preload() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
    }

    create() {
    }

    update() {
    }

    init() {
        this.disableTurn();
        this.myPlayer = null;
        this.opponentPlayer = null;
        var self = this;

        kapowWrapper.getUserInfo(function(user) {
            self.playerID = user.player.id;
            kapowWrapper.getRoomInfo(function(room) {
                for (var i = 0; i < 2; i++) {
                    if (room.players[i] != playerID) {
                        self.opponentID = room.players[i];
                    }
                }
            });
        });

        console.log("UserJID : " + this.playerID);
        console.log("opponentJID : " + this.opponentID);
        this.getPlayers();
    }

    getPlayers() {
        var opponentChoice = HistoryWrapper.getChoice(this.opponentID);
        var myChoice = HistoryWrapper.getChoice(this.playerID);

        if (myChoice == null) {
            myChoice = 1 - opponentChoice;
            sendChoice(myChoice);
        }

        if (opponentChoice == null) {
            opponentChoice = 1 - myChoice;
        }

        // get characters stored
    }

    sendChoice(choice) {
        kapowWrapper.callOnServer('sendTurn', new MoveData(choice, this.playerID, this.opponentID),
            function() {
                console.log("Character choose turn sent!");
            });
    }

    updateArena() {
    }

    sendMove(power, angle) {
        let move = new Move(this.myPlayer, this.opponentPlayer, power, angle, this.myPlayer.player.jid);
        let moveData = new MoveData(move, this.myPlayer.player.jid, this.opponentPlayer.player.jid);
        kapowWrapper.callOnServer('sendTurn', moveData);
        playMove(move);
    }

    playMove(move) {
        console.log("Emulating move");
        // this.game.physics.arcade.velocityFromAngle(angle, power, this.dragAndShoot.body.velocity);
        // this.dragAndShoot.body.allowGravity = true;
    }

    enableTurn() {
    }

    disableTurn() {
    }

    endGame(message) {
        console.log("End game called : " + JSON.stringify(message));
        this.game.state.start("GameOver");
    }

    dragFinished(draggedObject, pointer, initialObject) {
        let power = this.getDistance(initialObject.position, draggedObject.position);
        let angle = this.getAngle(initialObject.position, draggedObject.position);
        console.log("Power : " + power + " and Angle : " + angle);
        sendMove(power, angle);
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
}

export default Arena;
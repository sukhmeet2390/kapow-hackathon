import Tom from "../model/Toms";
import kapowWrapper from "../kapow/KapowWrapper";
import Move from "../model/Move";
import MoveData from "../model/MoveData";

class Arena extends Phaser.State {
    preload() {
        this.game.load.image('car', 'assets/player.png');
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
        this.currentTurn = 0;
    }

    create() {
        let button = this.game.add.button(this.game.world.centerX - 95, 400, 'car', this.actionOnClick, this, 2, 1, 0);
        var self = this;
        kapow.getUserInfo(function (owner) {
            console.log(owner);
            self.tom = new Tom(self.game, 0, 0, 'car', "296ai69lxpxa2a99@kapow.games");
            self.harry = new Tom(self.game, 0, 0, 'car', "rbuluxl6tcjrtrtx@kapow.games");
        });
    }

    actionOnClick() {
        console.log("Arena button clicked");
        if (this.currentTurn === 0) {
            // tom's turn
            kapowWrapper.callOnServer('sendTurn', new MoveData(new Move(this.tom.player, this.harry.player, 10, 10, this.tom.player.jid), this.tom.player.jid, this.harry.player.jid));
        } else {
            // harry's turn
            kapowWrapper.callOnServer('sendTurn', new MoveData(new Move(this.tom.player, this.harry.player, 10, 10, this.harry.player.jid), this.harry.player.jid, this.tom.player.jid));
        }
    }

    dragFinished(draggedObject, pointer, initialObject) {
        let power = this.getDistance(initialObject.position, draggedObject.position);
        let angle = this.getAngle(initialObject.position, draggedObject.position);

        console.log(power + " " + angle);

        this.game.physics.arcade.velocityFromAngle(angle, power, this.dragAndShoot.body.velocity);
        this.dragAndShoot.body.allowGravity = true;
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

    fire() {
        this.car = this.game.add.sprite(100, 1000, 'car');
        this.opponent = this.game.add.sprite(1250, 1000, 'car');
        this.game.physics.enable([this.car, this.opponent], Phaser.Physics.ARCADE);
        this.car.body.collideWorldBounds = true;
        this.opponent.body.allowGravity = false;
        this.game.physics.arcade.velocityFromAngle(-45, 700, this.car.body.velocity);
    }

    update() {
        // this.game.physics.arcade.collide(this.car, this.opponent, function(car, opponent) {
        // 	car.kill();
        // 	opponent.kill();
        // 	this.fire();
        // }, null, this);
    }

    updateHealth(message){
        if(message.data.sendBy == this.tom.player.jid){
            this.harry.health
        }
    }

}

export default Arena;

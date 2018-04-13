import ExampleObject from 'objects/ExampleObject';

class Main extends Phaser.State {

	preload() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 500;
	}

	create() {
		this.dragAndShoot = this.game.add.sprite(300, 1000, 'car');
		this.game.physics.enable([this.dragAndShoot], Phaser.Physics.ARCADE);
		this.dragAndShoot.body.allowGravity = false;

		this.dragAndShootTransparent = this.game.add.sprite(300, 1000, 'car');
		this.game.physics.enable([this.dragAndShootTransparent], Phaser.Physics.ARCADE);
		this.dragAndShootTransparent.inputEnabled = true;
		this.dragAndShootTransparent.body.allowGravity = false;
		this.dragAndShootTransparent.input.enableDrag(true);
		this.dragAndShootTransparent.alpha = 0.4;
		this.dragAndShootTransparent.events.onDragStop.add(this.dragFinished, this, 0, this.dragAndShoot);
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

}

export default Main;

import ExampleObject from 'objects/ExampleObject';

class Main extends Phaser.State {

	preload() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 400;
	}

	create() {
		this.car = this.game.add.sprite(100, 1000, 'car');
		this.game.physics.enable([this.car], Phaser.Physics.ARCADE);
		this.car.body.collideWorldBounds = true;
		this.game.physics.arcade.velocityFromAngle(-45, 700, this.car.body.velocity);
	}

	update() {
	}

}

export default Main;

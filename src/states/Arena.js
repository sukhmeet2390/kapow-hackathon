import Tom from "../model/Toms";

class Arena extends Phaser.State {

	create() {
		console.log("Arna Started");
		this.tom = new Tom(this.game, this.world.centerX, this.world.centerY, 'tom');
		this.game.stage.addChild(this.tom);
	}

	startGame() {
	}

    shutdown() {
        for (let i = this.game.stage.children.length - 1; i >= 0; i--) {
            this.game.stage.removeChild(this.game.stage.children[i]);
        }
    }
}

export default Arena;

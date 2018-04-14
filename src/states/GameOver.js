class GameOver extends Phaser.State {

	create() {
		console.log("Game over screen!");
	}

	restartGame() {
		this.game.state.start("Main");
	}

}

export default GameOver;

class Boot extends Phaser.State {

	preload() {
        console.log("Preloading Boot State");
	}

	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.state.start("Preload");
	}

}

export default Boot;
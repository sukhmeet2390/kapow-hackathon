import Lobby from 'states/Lobby';
import Preload from 'states/Preload';
import Arena from 'states/Arena';
import Menu from 'states/Menu';
import EvenHandler from 'handlers/EventHandler';
import GameOver from 'states/GameOver';

class Game extends Phaser.Game {

    constructor() {
        super(1920, 1080, Phaser.AUTO);
        this.state.add('Preload', Preload, false);
        this.state.add('Menu', Menu, false);
        this.state.add('Lobby', Lobby, false);
        this.state.add('Arena', Arena, false);
        this.state.add('GameOver', GameOver, false);
        EvenHandler.init();
        this.state.start('Preload');

    }

}
window.phasergame = new Game();
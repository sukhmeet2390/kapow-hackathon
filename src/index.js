import Lobby from 'states/Lobby';
import Preload from 'states/Preload';
import Arena from 'states/Arena';
import Menu from 'states/Menu';
import EvenHandler from 'handlers/EventHandler';
import GameOver from 'states/GameOver';

class Game extends Phaser.Game {

    constructor() {
        EvenHandler.init();
        super(1024, 700, Phaser.CANVAS);
        this.state.add('Preload', Preload, false);
        this.state.add('Menu', Menu, false);
        this.state.add('Lobby', Lobby, false);
        this.state.add('Arena', Arena, false);
        this.state.add('GameOver', GameOver, false);

        this.state.start('Preload');

    }

}

new Game();
"use strict";
import Power from "../model/Power";

export default class VisualPower extends Phaser.Sprite {
    constructor(game, x, y, label) {
        super(game, x, y, label);
        this.anchor.setTo(0.2, 0.2);
        this.frame = 0;
        this.power = new Power(10);
    }
}
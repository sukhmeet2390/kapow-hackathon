"use strict";

class Move {
    constructor(tom, harry, power, angle, wind, sentByJid) {
    	this.type = 'Move';
        this.tom = tom;
        this.harry = harry;
        this.power = power;
        this.angle = angle;
        this.wind = wind;
        this.sentBy = sentByJid;
    }
}

export default Move;
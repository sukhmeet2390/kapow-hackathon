"use strict";
import Health from './Health';

class Player {
    constructor(name, powers) {
        this.name = name;
        this.powers = [];
        this.health = new Health(100);
    }

    isAlive() {
        return this.health.value > 0;
    }

    isDead() {
        return this.health.value <= 0;
    }

    removePower(power) {
        let indexOf = this.powers.indexOf(power);
        if (indexOf > -1) this.powers.splice(indexOf, 1);
    }

    addPower(power) {
        this.powers.add(power);
    }
}
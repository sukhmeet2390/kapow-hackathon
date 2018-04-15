"use strict";
import Health from './Health';

export default class Player {
    constructor(name, jid, powers) {
        this.name = name;
        this.jid = jid;
        this.powers = powers;
        this.health = new Health(1);
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
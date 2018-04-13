"use strict";

export default class Health {
    constructor(value) {
        this.value = value;
    }

    addHealth(add) {
        this.value = this.value + add;
    }

    decreaseHealth(sub) {
        this.value = this.value - sub;
    }

    updateHealth(val) {
        this.value = val;
    }
}
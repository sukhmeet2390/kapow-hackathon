"use strict";

export default class CharacterChosen {
    constructor(characterId, chooserId) {
    	this.type = 'CharacterChosen';
    	this.characterId = characterId;
    	this.chooserId = chooserId;
    }
}
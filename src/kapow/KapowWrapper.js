"use strict";

let KapowWrapper = {
    _errback(error) {
        console.error("Something wrong happened", error);
    },
    startGameWithFriends(successBack, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.startGameWithFriends(2, 2, successBack, errBack);
    },
    startSoloGame(successBack, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.startSoloGame(successBack, errBack);
    },
    endGame(ranks, roomId, successBack, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.endGame(ranks, roomId, successBack, errBack);
    },

    share(text, medium, sucessBack, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.social.share(text, medium, successBack, errBack);
    },
    displayActiveRoms() {
        kapow.displayActiveRooms();
    },
    fetchAllHistory(successBack, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.fetchHistorySince(null, 50, successBack, errBack)
    },
    callOnServer(fnName, param, successBack, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.invokeRPC(fnName, param, successBack, errBack);
    },
    getGameData(key, successCb, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.gameStore.get(key, successCb, errBack);
    },
    setGameData(key, value, successCb, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.gameStore.set(key, value, successCb, errBack);
    },
    getRoomData(key, successCb, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.roomStore.get(key, successCb, errBack);
    },
    setRoomData(key, value, successCb, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.roomStore.set(key, value, successCb, errBack);
    },
    getUserInfo(successCb, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.getUserInfo(successCb, errBack);
    },
    getRoomInfo(successCb, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.getRoomInfo(successCb, errBack);
    },
    getPlayerInfo(playerId, successCb, errBack) {
        if (!errBack) errBack = this._errback;
        kapow.getPlayerInfo(playerId, successCb, errBack);
    },

};

window.game = {
    onLoad: function (room) {
        console.log("Room returned by kapow onLoad - " + JSON.stringify(room));
        pubsub.publish("kapow/game/loaded", [room]);

    },
    onPause: function () {
        console.log(':: On Pause Triggered. ::');
        pubsub.publish("kapow/game/paused", []);
    },
    onResume: function () {
        console.log(':: On Resume Triggered. ::');
        pubsub.publish("kapow/game/resumed", []);
    },
    onBackButtonPressed: function () {
        console.log(':: Back button press Triggered. ::');
        pubsub.publish("kapow/game/backButtonPressed", []);
        return true;
    },
    onGameEnd: function (outcome) {
        console.log(':: onGameEnd Triggered ::', outcome);
        pubsub.publish("kapow/game/gameEnd", [outcome]);
    },
    onTurnChange: function (player) {
        console.log(":: onTurnChange Triggered : " + JSON.stringify(player));
        pubsub.publish("kapow/game/turnChange", [player]);
    },
    onPlayerJoined: function (player) {
        console.log(":: onPlayerJoined Triggered : " + JSON.stringify(player));
        pubsub.publish("kapow/game/playerJoined", [player]);
    },
    onPlayerLeft: function (player) {
        console.log(":: onPlayerJoined Triggered : " + JSON.stringify(player));
        pubsub.publish("kapow/game/playerLeft", [player]);
    },
    onInviteRejected: function (player) {
        console.log(":: onInviteRejected Triggered : " + JSON.stringify(player));
        pubsub.publish("kapow/game/inviteRejected", [player]);
    },
    onMessageReceived: function (message) {
        console.log(":: onMessageReceived Triggered : " + JSON.stringify(message));
        pubsub.publish("kapow/game/messageReceived", [message]);
    }
};

export default KapowWrapper
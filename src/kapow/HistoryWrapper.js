"use strict";

import kapowWrapper from "./KapowWrapper"

let HistoryWrapper = {
    getAllMessages(successCB) {
        kapowWrapper.fetchAllHistory(successCB);
    },
    getChoice(playerID, successCB){
        this.getAllMessages(function(messages) {
            console.log("History fetch : " + JSON.stringify(messages));
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = messages[i];
                if (message.type == "move" && message.data.type == "CharacterChosen" && message.data.chooserId == playerID) {
                    successCB(message);
                    return;
                }
            }
            successCB(null);
        });
    },
    getLastMove(successCB) {
        this.getAllMessages(function(messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = messages[n - i - 1];
                if (message.type == "move" && message.data.type == "Move") {
                    successCB(message);
                    return;
                }
            }
            successCB(null);
        });
    },
    getOutcome(successCB) {
        this.getAllMessages(function(messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = messages[n - i - 1];
                if (message.type == "outcome") {
                    successCB(message);
                    return;
                }
            }
            successCB(null);
        });
    },
    getLastSyncState(successCB) {
        this.getAllMessages(function(messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = messages[n - i - 1];
                if (message.type == "move" && message.data.type == "SyncState") {
                    successCB(message);
                    return;
                }
            }
            successCB(null);
        });
    },
    getHeartMessage(playerId, successCB) {
        this.getAllMessages(function (messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = messages[n - i - 1];
                if (message.type == "move" && message.data.type == "HeartMove" && message.data.sentBy == playerId) {
                    successCB(message);
                    return;
                }
            }
            successCB(null);
        });
    }
};

export default HistoryWrapper;
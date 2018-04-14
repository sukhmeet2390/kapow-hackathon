"use strict";

import kapowWrapper from "./KapowWrapper"

let HistoryWrapper = {
    getAllMessages(successCB) {
        kapowWrapper.fetchAllHistory(successCB);
    },
    getChoice(playerID, successCB){
        getAllMessages(function(messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = messages[n - i - 1];
                if (message.type == "move" && message.data.type == "CharacterChosen" && message.data.chooserId == playerID) {
                    successCB(message);
                }
            }
            successCB(null);
        });
    },
    getLastMove(successCB) {
        getAllMessages(function(messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = messages[n - i - 1];
                if (message.type == "move" && message.data.type == "Move") {
                    successCB(message);
                }
            }
            successCB(null);
        });
    },
    getOutcome(successCB) {
        getAllMessages(function(messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = message[n - i - 1];
                if (message.type == "outcome") {
                    successCB(message);
                }
            }
            successCB(null);
        });
    }
};

export default HistoryWrapper;
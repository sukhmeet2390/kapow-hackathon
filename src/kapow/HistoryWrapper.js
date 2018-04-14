"use strict";

import kapowWrapper from "./KapowWrapper"

let HistoryWrapper = {
    getAllMessages(successCB) {
        kapowWrapper.fetchAllHistory(successCB);
    },
    getLastMove() {
        getAllMessages(function(messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = messages[i];
                if (message.type == "move") {
                    return message;
                }
            }
            return null;
        });
    },
    getOutcome() {
        getAllMessages(function(messages) {
            let n = messages.length;
            for (var i = 0; i < n; i++) {
                let message = message[i];
                if (message.type == "outcome") {
                    return message;
                }
            }
            return null;
        });
    }
};

export default HistoryWrapper;
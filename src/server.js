var mysql = require('mysql');

const GAME_CONST = {
};

console.log("SERVER JS!");

var game = {
    onMessageDelivered: function (data) {
        console.log("SERVER onMessageDelivered : " + JSON.stringify(data));
    },

    onPlayerJoined: function (playerObj) {
    	console.log("SERVER onPlayerJoined called : " + playerObj);
    },

    sendTurn: function (moveObj) {
    	console.log("SERVER sendTurn called : " + turn);
    	var room = kapow.getRoomInfo();
    	kapow.game.sendTurn(moveObj.move, room.roomId, moveObj.player, moveObj.opponent, null,
    		function() {
    			console.log("SERVER sendTurn successful!");
    		},
    		function(error) {
    			console.log("SERVER error in sendTurn : " + error);
    			kapow.return(null, error);
    		}
    	);
    },

    sendData: function (dataObj) {
    	console.log("SERVER sendData called : " + dataObj);
    	var room = kapow.getRoomInfo();
    	kapow.game.sendData(dataObj.data, dataObj.player, room.roomId,
    		function() {
    			console.log("SERVER sendData successful!");
    		},
    		function(error) {
    			console.log("SERVER error in sendData : " + error);
    			kapow.return(null, error);
    		}
    	);
    },

    resignationRequest: function (move) {
    	console.log("SERVER resignationRequest called : " + move);
    	quitGame(move.player, "resignation");
    },

    onPlayerLeft: function (playerObj) {
    	console.log("SERVER onPlayerLeft called : " + playerObj);
    	quitGame(playerObj.id, "left");
    },

    quitGame: function(playerId, outcomeType) {
    	console.log("SERVER quitGame called for playerId : " + playerId + " with outcomeType : " +  outcomeType);
    	var room = kapow.getRoomInfo();
        var ranking = [1, 2];
        if (room.players[0] === playerId) {
        	ranking[0] = 2;
        	ranking[1] = 1;
        }
        var outcome = createOutcome(room.players, ranking, outcomeType);
        endGame(room, outcome);
    },

    createOutcome: function(players, rankings, outcomeType) {
    	var outcome = {};
        outcome["ranks"] = {};
        outcome["type"] = outcomeType;
        for (var i = 0; i < 2; i++) {
        	outcome["ranks"][players[i]] = rankings[i];
        }
        return outcome;
    },

	endGame: function(room, outcome) {
		console.log("SERVER endGame called for room : " + JSON.stringify(room) + " with outcome : " 
			+ JSON.stringify(outcome));
		kapow.game.end(outcome, room.roomId,
			function() {
				console.log("SERVER endGame call successful!");
			},
			function (error) {
				console.log("SERVER error in endGame call : " + error);
				kapow.return(null, error);
			}
		);
	}
};
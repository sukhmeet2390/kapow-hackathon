import KapowWrapper from "../kapow/KapowWrapper";

class GameController{
    constructor(){
    }
    initNewGame(){
    // move to character selection screen
    // start a room
    // once done, call invoke RPC to store room details in db on server
    // Waiting mode in arena-
        KapowWrapper.startSoloGame(function(room){
            console.log("Started a new room", room);
        });
    }
    startOldGame(){
        // Case 1 : onPlayerJoined for a room (with no history)
//   Case 2 with history
    }

}
export default GameController;
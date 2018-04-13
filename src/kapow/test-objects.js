var room = {
    roomId: "room_identifier",
    state: "locked" / "unlocked",
    type: "solo", // (will be absent if it is not solo)
    nextPlayerId: "nextPlayer@kapow.games",
    players: []
};

var player = {
    name: "Kapow User",
    id: "kapow_user_identifier",
    profileImage: "https://example.com/photo.jpg",
    affiliation: "invited" , " accepted",  "left" "rejected"  "unknown"
}

var message = {
    messageId: "12381239182312",
    type: move / outcome / turn_change / affiliation_change / room_lock_status
    data: {...} / [...]
senderId: player_id
}
class Room {
  players = []
  list = []
  state = []
  roomId = ""

  constructor(roomId, player, socket) {
    this.roomId = roomId
    this.players.push(player)
  }
}
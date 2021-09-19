class Room {
  players = []
  list = []
  state = []
  roomId = ""

  constructor(roomId) {
    this.roomId = roomId
  }

  addPlayer(player) {
    players.push(player)
  }
}

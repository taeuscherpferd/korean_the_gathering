import { Player } from "./Player"

export class Room {
  players: Player[] = []
  list = []
  state = []
  roomId = ""

  constructor(roomId: string) {
    this.roomId = roomId
  }

  addPlayer(player: Player) {
    this.players.push(player)
  }
}

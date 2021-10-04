import { Card } from "./Card"
import { Player } from "./Player"

export class Room {
  players: Player[] = []
  list = []
  state = []
  cards = new Set<Card>()
  roomId = ""

  constructor(roomId: string) {
    this.roomId = roomId
  }

  addPlayer(player: Player) {
    this.players.push(player)
  }

  addCards(cards: Card[]) {
    cards.forEach(this.cards.add, this.cards)
  }

}

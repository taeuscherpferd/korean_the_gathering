import { Card } from "./Card"
import { Player } from "./Player"

export class Room {
  players: Player[] = []
  state = []
  cards = new Set<Card>()
  roomId = ""
  currentCard: Card | undefined

  constructor(roomId: string) {
    this.roomId = roomId
  }

  addPlayer(player: Player) {
    this.players.push(player)
  }

  addCards(cards: Card[]) {
    cards.forEach(this.cards.add, this.cards)
  }

  getCards() {
    return Array.from(this.cards)
  }

  getCardSlice() {
    return this.getCards().slice(0, 3).map((x) => x.term)
  }

  removePlayer(playerId: string) {
    this.players = this.players.filter((x) => x.id !== playerId)
  }

  removeCard(card: Card) {
    const foundCard = Array.from(this.cards).find((x) => x.term === card.term && x.definition === card.definition)
    if (!foundCard) return
    this.cards.delete(foundCard)
  }

  setCurrentCard(card: Card) {
    this.currentCard = card
  }

  getCurrentCard() {
    return this.currentCard
  }

  getCardByTerm(term: string) {
    return this.getCards().find((x) => x.term === term)
  }
}

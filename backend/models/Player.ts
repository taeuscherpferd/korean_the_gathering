export class Player {
  health = 10
  cardsInHand = []
  name = ""
  id = ""
  roomId = ""

  constructor(name: string, roomId: string, id: string) {
    this.name = name
    this.id = id
    this.roomId = roomId
  }
}
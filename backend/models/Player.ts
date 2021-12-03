export class Player {
  health = 10
  cardsInHand = []
  name = ""
  id = ""
  roomId = ""
  isReady = false
  isPlayScreenLoaded = false

  constructor(name: string, roomId: string, id: string) {
    this.name = name
    this.id = id
    this.roomId = roomId
  }

  getIsReady() {
    return this.isReady
  }

  setIsReady(isReady: boolean) {
    this.isReady = isReady
  }

  getIsPlayScreenLoaded() {
    return this.isPlayScreenLoaded
  }
  setIsPlayScreenLoaded(isPlayScreenLoaded: boolean) {
    this.isPlayScreenLoaded = isPlayScreenLoaded
  }
}
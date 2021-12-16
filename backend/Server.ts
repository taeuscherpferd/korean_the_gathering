import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { Card } from './models/Card';
import { Player } from './models/Player';
import { Room } from './models/Room';

const app = express();
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: "*" } })

let timerId: NodeJS.Timeout
app.use(cors())

const PORT = 8081;

const playerPool = []
const games = []

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Learn Korean you bum!"
  });
})

app.get("/test", (req, res, next) => {
  console.log("garbage")
  return res.status(200).json({
    message: "No CORS here"
  });
})

httpServer.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})

const rooms: Room[] = []

const getRoom = (roomId: string) => {
  return rooms.find(x => x.roomId === roomId)
}

const validateRequest = (roomId: string, socket: Socket) => {
  const room = getRoom(roomId)
  if (!room) {
    socket.emit("errorMessage", "Room Doesn't Exist!")
    return
  }

  if (!room.players.some((x) => x.id === socket.id)) {
    socket.emit("errorMessage", "unauthorized")
    return
  }

  return room
}

const startGuessTimer = (playerId: string, room: Room, currentTimeout: number = 0) => {
  const timeout = 15000
  timerId = setTimeout(() => {
    if (currentTimeout > timeout) {
      const player = room.players.find((x) => x.id === playerId)
      const opponent = room.players.find((x) => x.id !== playerId)

      if (!player) return
      if (!opponent) return

      player.health -= 1

      if (player.health <= 0) {
        const opponent = room.players.find((x) => x.id !== playerId)
        if (!opponent) return;
        io.to(room.roomId).emit('gameOver', `${opponent.name} wins!`)
        return
      }

      const cards = room.getCardSlice()
      if (checkGameOver(cards, player, opponent, room.roomId)) return

      io.to(playerId).emit("healthUpdate", player.health)
      io.to(playerId).emit("pickACard", cards)
      return
    }

    const timeRemainingInSec = Math.round((timeout - currentTimeout) / 1000)
    io.to(playerId).emit('updateTimeRemaining', timeRemainingInSec)

    startGuessTimer(playerId, room, currentTimeout + 1000)
  }, 1000)
}

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
  console.log('new client connected');

  socket.on("addToList", (socket) => {

  })

  socket.on("requestJoinRoom", ({ roomId }) => {
    rooms.forEach(x => {
      if (x.roomId === roomId) {
        socket.emit('roomFound', roomId)
        return
      }
    })

    socket.emit('errorMessage', "Room not found")
    return
  })

  socket.on("createRoom", ({ roomId }) => {
    for (let x of rooms) {
      if (x.roomId === roomId) {
        socket.emit('errorMessage', "Room already exists!")
        return
      }
    }

    const newRoom = new Room(roomId)
    rooms.push(newRoom)
    console.log("roomCreated")
    socket.emit('roomCreated', roomId)
  })

  socket.on("joinRoom", ({ roomId, name }) => {
    const room = getRoom(roomId)
    if (room === undefined || name === '') {
      io.to(socket.id).emit('errorMessage', "Stop spoofing you goof!")
      return
    }

    if (room.players.length >= 2) {
      io.to(socket.id).emit('errorMessage', "Room Full")
      return
    }

    socket.join(roomId)
    console.log("Just Joined ", socket.rooms)
    const id = socket.id
    const newPlayer = new Player(name, roomId, id)

    room.players.push(newPlayer)

    if (room.players.length === 1) {
      io.to(roomId).emit('waitingForPlayers')
    }
    else {
      io.to(roomId).emit('setupGame')
    }
  })

  socket.on("addToList", ({ words, roomId }) => {
    const room = getRoom(roomId)
    if (!room) {
      socket.emit("errorMessage", "Room Doesn't Exist!")
      return
    }

    //TODO: Limit card count
    if (!room.players.some((x) => x.id === socket.id)) {
      socket.emit("errorMessage", "unauthorized")
      return
    }

    if (!words) {
      socket.emit("errorMessage", "No words")
      return
    }

    const cardStrings = words.split("\n")
    const cards = cardStrings.map((x: string) => {
      const termDef = x.split(":")
      if (!termDef[0] || !termDef[1]) return
      return new Card(termDef[0].trim().toLocaleLowerCase(), termDef[1].trim().toLocaleLowerCase())
    })

    room.addCards(cards)
    io.to(roomId).emit('newWordsAdded', words)
  })

  socket.on("clientsReadyToPlay", ({ roomId }) => {
    const room = validateRequest(roomId, socket)
    if (!room) return

    const player = room.players.find(x => x.id === socket.id)
    player?.setIsPlayScreenLoaded(true)

    if (!room.players.every((x) => x.getIsPlayScreenLoaded())) return

    // Randomly select a player to start
    const startingPlayer = room.players[Math.floor(Math.random() * room.players.length)]

    const cards = room.getCardSlice()
    io.to(startingPlayer.id).emit('pickACard', cards)
  })

  socket.on("pickedCard", ({ roomId, cardTerm }) => {
    const room = validateRequest(roomId, socket)
    if (!room) return

    const opponent = room.players.find(x => x.id !== socket.id)

    if (!opponent) return
    const card = room.getCardByTerm(cardTerm)
    if (!card) return
    room.setCurrentCard(card)
    room.removeCard(card)

    io.to(opponent.id).emit('defendCard', card.term)
    startGuessTimer(opponent.id, room)
  });

  socket.on("startGame", ({ roomId }) => {
    const room = validateRequest(roomId, socket)
    if (!room) return

    const player = room.players.find(x => x.id === socket.id)

    player?.setIsReady(true)

    if (room.players.every(x => x.isReady)) {
      io.to(roomId).emit('gameStarted')
      const startingPlayer = room.players[Math.floor(Math.random() * room.players.length)]
      const cards = room.getCardSlice()
      io.to(startingPlayer.id).emit('pickACard', cards)
      console.log("Game Started")
    }
    else {
      socket.emit('waitingForPlayers')
    }
  })

  socket.on("submitAnswer", ({ roomId, answer }) => {
    console.log("submitted answer: ", answer)
    const room = validateRequest(roomId, socket)
    if (!answer) return
    if (!room) return

    clearTimeout(timerId)

    const player = room.players.find(x => x.id === socket.id)
    const opponent = room.players.find((x) => x.id !== socket.id)

    if (!opponent) return
    if (!player) return

    const sanitizedAnswer = answer.trim().toLowerCase()

    if (sanitizedAnswer !== room.getCurrentCard()?.definition) {
      player.health -= 1
      if (player.health <= 0) {
        io.to(roomId).emit('gameOver', `${opponent.name} wins!`)
      }
      io.to(player.id).emit("healthUpdate", player.health)
    }

    const cards = room.getCardSlice()
    if (checkGameOver(cards, player, opponent, roomId)) return

    io.to(player.id).emit("pickACard", cards)
  })

  socket.on("disconnecting", () => {
    const curRooms = Array.from(socket.rooms)
    console.log(curRooms)
    if (curRooms.length !== 2) return

    const room = getRoom(curRooms[1])
    room?.removePlayer(socket.id)

    if (room?.players.length === 1) {
      io.to(room.roomId).emit("opponentDisconnected")
      return
    }

    if (room) {
      rooms.splice(rooms.indexOf(room), 1)
    }

    console.log("Rooms after Disconnect ", rooms)
  })

});

function checkGameOver(cards: string[], player: Player, opponent: Player, roomId: any) {
  if (cards.length === 0) {
    if (player.health > opponent.health) {
      io.to(roomId).emit('gameOver', `${player.name} wins!`);
    }
    else if (player.health < opponent.health) {
      io.to(roomId).emit('gameOver', `${opponent.name} wins!`);
    }
    else {
      io.to(roomId).emit('gameOver', "It's a tie!");
    }
    return true
  }
  return false
}


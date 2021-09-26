import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Player } from './models/Player';
import { Room } from './models/Room';

const app = express();
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: "*" } })
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
  return rooms.find(x => roomId)
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
    rooms.forEach(x => {
      if (x.roomId === roomId) {
        socket.emit('errorMessage', "Room already exists!")
        return
      }
    })

    const newRoom = new Room(roomId)
    rooms.push(newRoom)
    socket.emit('roomCreated', roomId)
  })

  socket.on("joinRoom", ({ roomId, name }) => {
    const room = getRoom(roomId)
    if (room === undefined || name === '') {
      io.to(socket.id).emit('joinError')
      return
    }

    if (room.players.length >= 2) {
      io.to(socket.id).emit('roomFull')
      return
    }

    socket.join(roomId)
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
    
    //TODO: Limit card count
    if (!room.players.some((x) => x.id === socket.id)) {
      socket.emit("unauthorized")
      return
    }
     
    const cardStrings = words.split("\n")
    const cards = cardStrings.map((x) => {
      const termDef = x.split(":")
      return new Card(termDef[0], termDef[1])
    })

    room.cards.push(cards)
  })

  socket.on("startGame", (socket) => {
    //TODO: Set up the game 

  })

  socket.on("submitAnswer", (socket) => {

  })

  socket.on("disconnect", () => {

  })

  socket.on("getOponents", () => {

  })

  socket.on("selectOponent", () => {

  })
});

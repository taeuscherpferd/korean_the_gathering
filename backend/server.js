const express = require('express');
const Room = require('./Models/Room')
const Player = require('./Models/Player')
const Card = require('./Models/Card')
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http, { cors: { origin: "*" } })
const cors = require('cors');
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

http.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})

const rooms = []

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
  console.log('new client connected');

  socket.on("addToList", (socket) => {

  })

  socket.on("requestJoinRoom", ({ room }) => {
    rooms.forEach(x => {
      if (x.roomId === room) {
        socket.emit('roomFound', room)
        return
      }
    })

    socket.emit('errorMessage', "Room not found")
    return
  })

  socket.on("createRoom", ({ room }) => {
    rooms.forEach(x => {
      if (x.roomId === room) {
        socket.emit('errorMessage', "Room already exists!")
        return
      }
    })

    const newRoom = new Room(room)
    socket.emit('roomCreated', room)
  })

  socket.on("joinRoom", (socket) => {

  })

  socket.on("addToList", (socket, {words}) => {

  })

  socket.on("startGame", (socket) => {

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

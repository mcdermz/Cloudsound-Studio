// see bin/www for where to attach this io instance to the app
var io = require('socket.io')();

// every time a socket connection is made, this function is called
io.on('connection', function (socket) {
  socket.emit('welcome', 'enter a ROOM NAM to get started');

  socket.on('create room', function (roomName) {
    socket.join(roomName)
    io.to(roomName).emit('welcome', `${socket.id} has entered room: ${roomName}!`)
  });

  socket.on('sent-message', function(data){
    io.to(data.room).emit('received-message', data.msg)
  })

  socket.on('play track', function(socketEvent){
    const response = `Server says ${socketEvent}`
    io.emit('play track', response)
  })

  socket.on('stop track', function(socketEvent){
    const response = `Server says ${socketEvent}`
    io.emit('stop track', response)
  })
})

module.exports = io;

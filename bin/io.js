// see bin/www for where to attach this io instance to the app
var io = require('socket.io')();

// every time a socket connection is made, this function is called
io.on('connection', function (socket) {
  socket.emit('welcome', 'enter a ROOM NAM to get started');

  socket.on('create room', function (roomName) {
    socket.join(roomName)
    io.to(roomName).emit('room created', `${socket.id} has entered room: ${roomName}!`)
  });

  socket.on('sent-message', function(data){
    io.to(data.room).emit('received-message', data.msg)
  })

  socket.on('play track', function(roomName){
    io.to(roomName).emit('play track', 'Server: all tracks are playing!')
  })

  socket.on('stop track', function(roomName){
    io.to(roomName).emit('stop track', 'Server: all tracks are stopped!')
  })
})

module.exports = io;

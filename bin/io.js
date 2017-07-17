// see bin/www for where to attach this io instance to the app
var io = require('socket.io')();

// every time a socket connection is made, this function is called
io.on('connection', function (socket) {
  socket.emit('welcome', 'enter a ROOM NAM to get started');

  socket.on('create room', function (roomName) {
    socket.join(roomName)
    io.to(roomName).emit('room created', `${socket.id} has entered room: ${roomName}!`)
  });

  socket.on('sent-message', function(data) {
    io.to(data.room).emit('received-message', data.msg)
  })

  socket.on('play track', function(data) {
    io.to(data.room).emit('play track', 'Server: all tracks are playing!')
    io.to(data.room).emit('play status', data.isPlaying)
  })

  socket.on('stop track', function(data) {
    io.to(data.room).emit('stop track', 'Server: all tracks are stopped!')
    io.to(data.room).emit('play status', data.isPlaying)
  })

  socket.on('send fader level', function(data) {
    socket.to(data.room).emit('receive fader level', data)
  })

  socket.on('send solo track', function(data) {
    socket.to(data.room).emit('receive solo track', data)
  })

  socket.on('send mute track', function(data) {
    socket.to(data.room).emit('receive mute track', data)
  })
})

module.exports = io;

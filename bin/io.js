// see bin/www for where to attach this io instance to the app
var io = require('socket.io')();

// every time a socket connection is made, this function is called
io.on('connection', function (socket) {

  let clientsCount = function(room) {
    return io.of(room).server.eio.clientsCount
  }

  socket.emit('welcome', 'enter a ROOM NAM to get started');

  socket.on('create room', function (room) {
    socket.join(room)
    let data = { room, id: socket.id}
    io.to(room).emit('room created', data)
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
    if (clientsCount(data.room) > 1) {
      socket.to(data.room).emit('receive solo track', data)
    }
    else {
      io.to(data.room).emit('receive solo track', data)
    }
  })

  socket.on('send mute track', function(data) {
    if (clientsCount(data.room) > 1) {
      socket.to(data.room).emit('receive mute track', data)
    }
    else {
      io.to(data.room).emit('receive mute track', data)
    }
  })

  socket.on('send mute by solo', function(data) {
    if (clientsCount(data.room) > 1) {
      socket.to(data.room).emit('receive mute by solo', data)
    }
    else {
      io.to(data.room).emit('receive mute by solo', data)
    }
  })

  socket.on('clear solo', function(data) {
    io.to(data.room).emit('clear solo', data)
  })

  socket.on('parameter is occupied', function(data) {
    socket.to(data.room).emit('occupy parameter', data)
  })

  socket.on('parameter is unoccupied', function(data) {
    socket.to(data.room).emit('unoccupy parameter', data)
  })
})

module.exports = io;

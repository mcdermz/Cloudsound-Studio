// see bin/www for where to attach this io instance to the app
var io = require('socket.io')();

// every time a socket connection is made, this function is called
io.on('connection', function (socket) {

  let clientsCount = function(room) {
    return io.of(room).server.eio.clientsCount
  }

  socket.emit('welcome', 'enter a ROOM NAM to get started');

  socket.on('create room', function(room) {
    socket.join(room)
    let data = { room, id: socket.id}
    io.to(room).emit('room created', data)
    socket.emit('receive socket id', data)
  })

  // socket.on('8 track toggle', function(data) {
  //   io.to(data.room).emit('8 track toggle', data)
  // })

  socket.on('sent-message', function(data) {
    io.to(data.room).emit('received-message', data)
  })

  socket.on('play all tracks', function(data) {
    io.to(data.room).emit('play all tracks', 'Server: all tracks are playing!')
    io.to(data.room).emit('play status', data.isPlaying)
  })

  socket.on('play track', function(data){
    io.to(data.room).emit('play track', data)
  })

  socket.on('stop track', function(data){
    io.to(data.room).emit('stop track', data)
  })

  socket.on('stop all tracks', function(data) {
    io.to(data.room).emit('stop all tracks', 'Server: all tracks are stopped!')
    io.to(data.room).emit('play status', data.isPlaying)
  })

  socket.on('send fader level', function(data) {
    io.to(data.room).emit('receive fader level', data)
  })

  socket.on('send solo track', function(data) {
    io.to(data.room).emit('receive solo track', data)
  })

  socket.on('send mute track', function(data) {
    io.to(data.room).emit('receive mute track', data)
  })

  socket.on('send mute by solo', function(data) {
    io.to(data.room).emit('receive mute by solo', data)
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

  socket.on('change track source', function(data) {
    io.to(data.room).emit('receive source change', data)
  })
})

module.exports = io;

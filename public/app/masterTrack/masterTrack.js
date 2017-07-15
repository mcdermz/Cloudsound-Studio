(function (){
  angular.module('app')
    .component('masterTrack', {
      controller: controller,
      templateUrl: './app/masterTrack/masterTrack.html',
    })

  controller.$inject = ['socket', 'audioService', '$state']

  function controller(socket, audioService, $state) {
    const vm = this
    const room = $state.params.room
    const ctx = audioService.ctx
    const mainOutput = ctx.createGain()
          mainOutput.gain.value = 1
          mainOutput.connect(ctx.destination)

    audioService.masterGain.connect(mainOutput)

    const data = { room }

    socket.on('play status', function(msg) {
      vm.playing = msg.playing
    })

    vm.faderChange = function() {
      audioService.masterGain.gain.value = vm.fader / 100
    }

    vm.sendPlayMessage = function() {
      data.playing = true
      socket.emit('play track', data)
    }

    vm.sendStopMessage = function() {
      data.playing = false
      socket.emit('stop track', data)
    }
  }
})()

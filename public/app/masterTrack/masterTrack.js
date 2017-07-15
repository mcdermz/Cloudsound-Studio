(function (){
  angular.module('app')
    .component('masterTrack', {
      controller: controller,
      templateUrl: './app/masterTrack/masterTrack.html',
    })

  controller.$inject = ['socket', 'audioService', '$state']

  function controller(socket, audioService, $state) {
    const vm = this
    const roomName = $state.params.room
    const ctx = audioService.ctx
    const mainOutput = ctx.createGain()
          mainOutput.gain.value = 1
          mainOutput.connect(ctx.destination)

    audioService.masterGain.connect(mainOutput)

    vm.faderChange = function() {
      audioService.masterGain.gain.value = vm.fader / 100
    }

    vm.sendPlayMessage = function (){
      socket.emit('play track', roomName)
    }

    vm.sendStopMessage = function (){
      socket.emit('stop track', roomName)
    }


  }
})()

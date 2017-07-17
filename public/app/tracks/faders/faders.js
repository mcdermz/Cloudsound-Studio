(function (){
  angular.module('app')
    .component('faders', {
      controller: controller,
      templateUrl: './app/tracks/faders/faders.html',
      bindings: {
        trackName: '@',
        fader: '=',
        gainNode: '='
      },
    })

  controller.$inject = ['socket', '$state']

  function controller(socket, $state){
    const vm = this
    let data = {}

    vm.$onInit = function() {
      data = {
        room: $state.params.room,
        track: vm.trackName,
        level: vm.fader
      }
    }

    vm.faderChange = function() {

      if (!vm.muted) vm.gainNode.gain.value = vm.fader/100
      socket.emit('send fader level', data)
    }

    vm.muteTrack = function() {
      socket.emit('mute track', data)
    }

    vm.soloTrack = function() {
      socket.emit('solo track', data)
    }

    socket.on('solo track', function(msg) {
      if (msg !== vm.trackName) {
        if (!vm.soloed) {
          vm.muted = true
        }
      }
      else if (!vm.soloed){
        vm.soloed = true
        vm.muted = false
      }
      else {
        vm.soloed = false
      }
    })
  }
})()

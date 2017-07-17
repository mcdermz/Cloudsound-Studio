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

  controller.$inject = ['socket', 'studioService', '$state']

  function controller(socket, studioService, $state){
    const vm = this
    let data = {}

    vm.$onInit = function() {
      data = {
        room: $state.params.room,
        track: vm.trackName,
        level: vm.fader
      }

      vm.soloedTracks = studioService.soloedTracks
    }

    vm.faderChange = function() {
      if (!vm.isMuted) vm.gainNode.gain.value = vm.fader/100
      socket.emit('send fader level', data)
    }

    vm.muteTrack = function(send=true) {
      data.sendMute = send
      socket.emit('mute track', data)
    }

    vm.soloTrack = function() {
      socket.emit('solo track', data)
    }

    socket.on('solo track', function(msg) {
      if (msg.track === vm.trackName) {
        vm.isSoloed = !vm.isSoloed;
        studioService.soloedTracks += (vm.isSoloed) ? 1 : -1;
        if (studioService.soloedTracks === 0) vm.muteTrack(false);
      }
      vm.muteTrack()
    })

    socket.on('mute track', function(msg) {
      if (msg.track === vm.trackName) {
        if (studioService.soloedTracks === 0 ) {
          vm.isMuted = !vm.isMuted
        }
        else if (!vm.isSoloed) {
          vm.isMuted = true
        }
        else {
          vm.isMuted = false
        }
      }
    })
  }
})()

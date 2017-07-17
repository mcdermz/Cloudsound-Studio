(function (){
  angular.module('app')
    .component('faders', {
      controller: controller,
      templateUrl: './app/tracks/faders/faders.html',
      bindings: {
        trackName: '@',
        fader: '=',
        gainNode: '=',
        isMuted: '='
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
      }
      vm.soloedTracks = studioService.soloedTracks
    }

    vm.faderChange = function() {
      data.fader = vm.fader
      vm.gainNode.gain.value = (vm.isMuted) ? 0 : vm.fader/100
      socket.emit('send fader level', data)
    }

    vm.muteTrack = function() {
      data.socketId = studioService.socketId
      socket.emit('send mute track', data)
    }

    vm.soloTrack = function() {
      data.socketId = studioService.socketId
      socket.emit('send solo track', data)
    }

    const onSolo = function(vm) {
      return function(msg) {
        if (msg.track === vm.trackName) {
          vm.isSoloed = !vm.isSoloed;
          studioService.soloedTracks += (vm.isSoloed) ? 1 : -1;
          if (studioService.soloedTracks === 0) vm.muteTrack()
        }
        vm.muteTrack()
      }
    }

    const onMute = function(vm) {
      return function(msg) {
        if (msg.track === vm.trackName) {
          vm.isMuted = (studioService.soloedTracks === 0) ? !vm.isMuted : (!vm.isSoloed) ? true : false;
        }
        vm.gainNode.gain.value = (vm.isMuted) ? 0 : vm.fader/100
      }
    }
    socket.on('receive solo track', onSolo(vm))
    socket.on('receive mute track', onMute(vm))
  }
})()

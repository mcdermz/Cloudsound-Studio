(function (){
  angular.module('app')
    .component('faders', {
      controller: controller,
      templateUrl: './app/tracks/faders/faders.html',
      bindings: {
        trackName: '@',
        fader: '=',
        gainNode: '=',
        isMuted: '=',
        isMutedBySolo: '=',
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
      socket.emit('send mute track', data)
    }

    vm.soloTrack = function() {
      socket.emit('send solo track', data)
    }

    vm.occupiedByUser = function() {
      data.parameter = 'fader'
      socket.emit('parameter is occupied', data)
    }

    vm.unoccupiedByUser = function() {
      data.parameter = 'fader'
      socket.emit('parameter is unoccupied', data)
    }

    const onSolo = function(vm) {
      return function(msg) {
        if (msg.track === vm.trackName) {
          vm.isSoloed = !vm.isSoloed
          studioService.soloedTracks += (vm.isSoloed) ? 1 : -1
          socket.emit('send mute by solo', data)
        }
      }
    }

    const onMute = function(vm) {
      return function(msg) {
        if (msg.track === vm.trackName) {
          vm.isMuted = !vm.isMuted
          vm.gainNode.gain.value = (vm.isMutedBySolo || vm.isMuted) ? 0 : vm.fader/100
        }
      }
    }

    const onMuteBySolo = function(vm) {
      return function(msg) {
        if (msg.track !== vm.trackName) {
          vm.isMutedBySolo = (!vm.isSoloed) ? (studioService.soloedTracks > 0) : false
        }
        else {
          vm.isMutedBySolo = (studioService.soloedTracks > 0) ? (!vm.isSoloed) : false
        }

        vm.gainNode.gain.value = (vm.isMutedBySolo || vm.isMuted) ? 0 : vm.fader/100
      }
    }

    socket.on('receive solo track', onSolo(vm))
    socket.on('receive mute track', onMute(vm))
    socket.on('receive mute by solo', onMuteBySolo(vm))
    socket.on('occupy parameter', studioService.onOccupy(vm, 'fader', true))
    socket.on('unoccupy parameter', studioService.onOccupy(vm, 'fader', false))
  }
})()

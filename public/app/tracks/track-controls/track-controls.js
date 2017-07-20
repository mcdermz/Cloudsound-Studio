(function (){
  angular.module('app')
    .component('track-controls', {
      controller: controller,
      templateUrl: './app/tracks/track-controls/track-controls.html',
      bindings: {
        trackName: '@',
        fader: '<',
        gainNode: '=',
      },
    })

  controller.$inject = ['socket', 'studioService', 'tracksService']

  function controller(socket, studioService, tracksService){
    const vm = this

    const setData = function() {
      return tracksService.setTrackData(vm)
    }

    const getData = function(data) {
      tracksService.getTrackData(vm, data)
    }

    vm.faderChange = function() {
      const data = setData()
      socket.emit('send fader level', data)
    }

    vm.muteTrack = function() {
      const data = setData()
      data.isMuted = (vm.isMuted) ? false : true
      socket.emit('send mute track', data)
    }

    vm.soloTrack = function() {
      studioService.soloedTracks += (!vm.isSoloed) ? 1 : -1
      const data = setData()
      data.isSoloed = (vm.isSoloed) ? false : true
      socket.emit('send solo track', data)
    }

    vm.occupiedByUser = function() {
      const data = setData()
      data.parameter = 'fader'
      socket.emit('parameter is occupied', data)
    }

    vm.unoccupiedByUser = function() {
      const data = setData()
      data.parameter = 'fader'
      socket.emit('parameter is unoccupied', data)
    }

    const onSolo = function(vm) {
      return function(msg) {
        if (msg.trackName === vm.trackName) {
          getData(msg)
          const data = setData()
          socket.emit('send mute by solo', data)
        }
      }
    }

    const onMute = function(vm) {
      return function(msg) {
        if (msg.trackName === vm.trackName) {
          getData(msg)
          vm.gainNode.gain.value = (vm.isMutedBySolo || vm.isMuted) ? 0 : vm.fader/100
        }
      }
    }

    const onMuteBySolo = function(vm) {
      return function(msg) {
        if (msg.trackName !== vm.trackName) {
          studioService.soloedTracks = msg.soloedTracks
          vm.isMutedBySolo = (!vm.isSoloed) ? (studioService.soloedTracks > 0) : false
          vm.gainNode.gain.value = (vm.isMutedBySolo || vm.isMuted) ? 0 : vm.fader/100
        }
        else {
          msg.isMutedBySolo = (!msg.isSoloed) ? (msg.soloedTracks > 0) : false
          getData(msg)
        }
      }
    }

    const clearSolo = function(vm) {
      return function(msg) {
        vm.isSoloed = false
        vm.isMutedBySolo = false
        studioService.soloedTracks = 0
        vm.gainNode.gain.value = (vm.isMuted) ? 0 : vm.fader/100
      }
    }

    socket.on('receive solo track', onSolo(vm))
    socket.on('receive mute track', onMute(vm))
    socket.on('receive mute by solo', onMuteBySolo(vm))
    socket.on('clear solo', clearSolo(vm))
    socket.on('occupy parameter', studioService.onOccupy(vm, 'fader', true))
    socket.on('unoccupy parameter', studioService.onOccupy(vm, 'fader', false))
  }
})()

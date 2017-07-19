(function (){
  angular.module('app')
    .component('faders', {
      controller: controller,
      templateUrl: './app/tracks/faders/faders.html',
      bindings: {
        trackName: '@',
        fader: '=',
        gainNode: '=',
      },
    })

  controller.$inject = ['socket', 'studioService', 'tracksService', '$state']

  function controller(socket, studioService, tracksService, $state){
    const vm = this

    const setData = function() {
      let data = {
        room: $state.params.room,
        trackName: vm.trackName,
        isMuted: vm.isMuted || false,
        isMutedBySolo: vm.isMutedBySolo || false,
        isSoloed: vm.isSoloed || false,
        fader: vm.fader,
        soloedTracks: studioService.soloedTracks
      }
      return data
    }

    const getData = function(data) {
      vm.trackName = data.trackName
      vm.isMuted = data.isMuted
      vm.isMutedBySolo = (data.isMutedBySolo && !data.isSoloed)
      vm.isSoloed = data.isSoloed
      vm.fader = data.fader
      studioService.soloedTracks = data.soloedTracks
      vm.gainNode.gain.value = (data.isMuted || data.isMutedBySolo) ? 0 : data.fader/100
    }

    vm.$onInit = function() {
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
      const data = setData()
      data.isSoloed = (vm.isSoloed) ? false : true
      data.soloedTracks += (data.isSoloed) ? 1 : -1
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

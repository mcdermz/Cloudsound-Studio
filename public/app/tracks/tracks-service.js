(function (){
  'use strict'

  angular.module('app')
  .service('tracksService', service)

  service.$inject = ['$state', 'studioService']

  function service($state, studioService){

    this.sourceDisplayName = function(url) {
      const arr = url.split('/')
      const category = arr[0].toUpperCase()
      const sampleFile = arr[1].split('.')
      let sampleName = sampleFile[0].split('-').map(el => {
        if (el.charAt(0).match(/[a-z]/)) {
          return el.charAt(0).toUpperCase() + el.substr(1)
        } else {
          return el
        }
      })
      sampleName = sampleName.join(' ')

      return { category, sampleName, url }
    }

    this.setTrackData = function(vm) {
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

    this.getTrackData = function(vm, data, track) {
      vm.trackName = data.trackName
      vm.isMuted = data.isMuted
      vm.isMutedBySolo = (data.isMutedBySolo && !data.isSoloed)
      vm.isSoloed = data.isSoloed
      vm.fader = data.fader
      studioService.soloedTracks = data.soloedTracks
      vm.gainNode.gain.value = (data.isMuted || data.isMutedBySolo) ? 0 : data.fader/100
    }
  }
})()

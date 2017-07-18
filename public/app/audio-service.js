(function (){
  'use strict'

  angular.module('app')
  .service('audioService', service)

  service.$inject = ['$http', 'visualizerService']

  function service($http, visualizerService){
    window.AudioContext = window.AudioContext||window.webkitAudioContext

    this.ctx = new AudioContext()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0

    this.getData = async function(track) {
      const urlPkg = {
        method: 'GET',
        url: track.url,
        responseType: 'arraybuffer'
      }
      track.source = this.ctx.createBufferSource()
      track.analyser = this.ctx.createAnalyser()
      analyserConfig(track)
      try {
        let audioData = await $http(urlPkg)
        let buffer = await this.ctx.decodeAudioData(audioData.data)
        track.source.buffer = buffer
        track.source.loop = true

        track.source.loopEnd = buffer.duration/2.020 // for gapless looping

        chainTrackFX(track).connect(this.masterGain)
        visualizerService.visualizeTrack(track)
        track.source.start()
      }
      catch (error) {
        console.error(error);
      }
    }

    const analyserConfig = function(track) {
      track.analyser.minDecibels = -90
      track.analyser.maxDecibels = -10
      track.analyser.smoothingTimeConstant = 0.85
    }

    const chainTrackFX = function(track) {
      track.source.connect(track.gainNode)
      track.gainNode.connect(track.analyser)
      return track.analyser
    }
  }
})()

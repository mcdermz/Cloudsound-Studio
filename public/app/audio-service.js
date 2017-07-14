(function (){
  'use strict';

  angular.module('app')

    .service('audioService', service)

    service.$inject = ['$http', 'visualizerService']

    function service($http, visualizerService){
      window.AudioContext = window.AudioContext||window.webkitAudioContext

      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 1
      this.masterGain.connect(this.ctx.destination)

      const analyser = this.ctx.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      this.getData = async function(track) {
        const urlPkg = {
          method: 'GET',
          url: track.url,
          responseType: 'arraybuffer'
        }
        track.source = this.ctx.createBufferSource()
        track.analyser = analyser
        try {
          let audioData = await $http(urlPkg)
          let buffer = await this.ctx.decodeAudioData(audioData.data)
          track.source.buffer = buffer
          track.source.connect(track.gainNode)
          track.gainNode.connect(track.analyser)
          track.analyser.connect(this.masterGain)
          track.source.loop = true;
          
          visualizerService.visualizeTrack(track)
        }
        catch (error) {
          console.error(error);
        }
      }
    }
})()

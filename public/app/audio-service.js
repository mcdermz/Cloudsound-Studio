(function (){
  'use strict';

  angular.module('app')

    .service('audioService', service)

    service.$inject = ['$http']

    function service($http){
      window.AudioContext = window.AudioContext||window.webkitAudioContext

      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()

      this.masterGain.gain.value = 0
      this.masterGain.connect(this.ctx.destination)

      this.getData = async function(track) {
        const urlPkg = {
          method: 'GET',
          url: track.url,
          responseType: 'arraybuffer'
        }

        track.source = this.ctx.createBufferSource()
        try {
          let audioData = await $http(urlPkg)
          let buffer = await this.ctx.decodeAudioData(audioData.data)
          track.source.buffer = buffer
          track.source.connect(this.masterGain);
          track.source.loop = true;
        }
        catch (error) {
          console.error(error);
        }
      }
    }
})()

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
        // request.onload = function() {
        //     context.decodeAudioData(request.response, function(response) {
        //         source.buffer = response;
        //         source.start(0);
        //         source.loop = true;
        //     }, function () { console.error('The request failed.'); } );
        // }
      var request = new XMLHttpRequest();
      request.open('GET', track.url, true)
      request.responseType = 'arraybuffer'
      var ctx = this.ctx
      var masterGain = this.masterGain
      request.onload = function() {
        ctx.decodeAudioData(request.response, function(response) {
          track.source.buffer = response
          chainTrackFX(track).connect(masterGain)
          visualizerService.visualizeTrack(track)
          track.source.loop = true
          track.source.loopEnd = response.duration / 2.195
          track.source.start()
        }, function() {
          console.error(error);
        })
      }
      request.send()
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

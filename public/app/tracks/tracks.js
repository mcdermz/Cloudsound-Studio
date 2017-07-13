(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
    })

  controller.$inject = ['socketService', '$state', '$http']
  function controller(socketService, $state, $http) {
    const vm = this

    window.AudioContext = window.AudioContext||window.webkitAudioContext

    const ctx = new AudioContext()
    const masterGain = ctx.createGain()

    masterGain.gain.value = 0
    masterGain.connect(ctx.destination)


    const track = {
      url: '/audio/tone-samples.mp3',
    }

    vm.getData = async function(track) {
      const urlPkg = {
        method: 'GET',
        url: track.url,
        responseType: 'arraybuffer'
      }

      track.source = ctx.createBufferSource()
      try {
        let audioData = await $http(urlPkg)
        let buffer = await ctx.decodeAudioData(audioData.data)
        track.source.buffer = buffer
        track.source.connect(masterGain);
        track.source.loop = true;
      }
      catch (error) {
        console.error(error);
      }
    }

    vm.play = function (){
      vm.playing = true
      vm.getData(track);
      track.source.start(0);
      masterGain.gain.value = 1
    }

    vm.stop = function (){
      vm.playing = false
      masterGain.gain.value = 0
      track.source.stop(ctx.currentTime + 0.1)
    }

  }
})()

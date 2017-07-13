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

    let source

    const audioObj = {
      method: 'GET',
      url: '/audio/tone-samples.mp3',
      responseType: 'arraybuffer'
    }

    vm.getData = async function(audio) {
      source = ctx.createBufferSource()
      try {
        let audioData = await $http(audio)
        let buffer = await ctx.decodeAudioData(audioData.data)
        source.buffer = buffer
        source.connect(masterGain);
        source.loop = true;
      }
      catch (error) {
        console.error(error);
      }
    }

    vm.play = function (){
      vm.playing = true
      vm.getData(audioObj);
      source.start(0);
      masterGain.gain.value = 1
    }

    vm.stop = function (){
      vm.playing = false
      masterGain.gain.value = 0
      source.stop(ctx.currentTime + 0.1)
    }

  }
})()

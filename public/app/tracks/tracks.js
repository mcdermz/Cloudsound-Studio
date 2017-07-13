(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
    })

  controller.$inject = ['socketService', '$state', '$http']
  function controller(socketService, $state, $http) {
    const vm = this
    const socket = socketService.socket

    window.AudioContext = window.AudioContext||window.webkitAudioContext

    const ctx = new AudioContext()
    const masterGain = ctx.createGain()

    masterGain.gain.value = 0
    masterGain.connect(ctx.destination)

    let source



    vm.getData = async function() {
      source = ctx.createBufferSource()

      try {
        let response = await $http({
            method: 'GET',
            url: '/audio/tone-samples.mp3',
            responseType: 'arraybuffer'
        })

        let buffer = await ctx.decodeAudioData(response.data)
        source.buffer = buffer
        source.connect(masterGain);
        source.loop = true;
      }
      catch (error) {
        console.error(error);
      }
    }


    vm.play = function (){
      vm.getData();
      source.start(0);
      masterGain.gain.value = 1
    }

    vm.stop = function (){
      masterGain.gain.value = 0
      source.stop(ctx.currentTime + 0.1)
    }

  }
})()

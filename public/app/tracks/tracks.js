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

    vm.getData = function() {
      source = ctx.createBufferSource()
      $http({
          method: 'GET',
          url: '/audio/tone-samples.mp3',
          responseType: 'arraybuffer'
      }).then(response => {
          ctx.decodeAudioData(response.data)
          .then(buffer => {
            source.buffer = buffer
            source.connect(ctx.destination);
            source.loop = true;
          })
      }).catch(err => {
        console.error(err);
      })
    }


    vm.play = function (){
      vm.getData();
      source.start(0);
    }

    vm.stop = function (){
      source.stop()
    }

  }
})()

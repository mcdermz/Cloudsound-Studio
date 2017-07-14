(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
      bindings: {
        trackName: '@'
      },
    })

  controller.$inject = ['socket', 'audioService', 'visualizerService', '$state', '$scope']

  function controller(socket, audioService, visualizerService, $state, $scope) {
    const vm = this
    const ctx = audioService.ctx
    const gainNode = ctx.createGain()
    gainNode.gain.value = 0

    const url = '/audio/tone-samples.mp3'

    const analyser = ctx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    const track = { gainNode, analyser, url }

    vm.$onInit = function() {
      track.trackName = vm.trackName
    }


    socket.on('play track', function(msg){
      vm.play()
    })

    socket.on('stop track', function(msg){
      vm.stop()
    })

    vm.play = function (){
      vm.playing = true
      audioService.getData(track);
      visualizerService.visualizeTrack(track)
      track.source.start(0);
      gainNode.gain.value = 1
    }

    vm.stop = function (){
      vm.playing = false
      gainNode.gain.value = 0
      track.source.stop(ctx.currentTime + 0.1)
    }
  }
})()

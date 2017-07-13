(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
    })

  controller.$inject = ['socketService', 'audioService', '$state']
  function controller(socketService, audioService, $state) {
    const vm = this
    const track = {
      url: '/audio/tone-samples.mp3',
    }

    vm.play = function (){
      vm.playing = true
      audioService.getData(track);
      track.source.start(0);
      audioService.masterGain.gain.value = 1
    }

    vm.stop = function (){
      vm.playing = false
      audioService.masterGain.gain.value = 0
      track.source.stop(audioService.ctx.currentTime + 0.1)
    }

  }
})()

(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
    })

  controller.$inject = ['socketService', 'audioService', '$state']

  function controller(socketService, audioService, $state) {
    const vm = this
    const ctx = audioService.ctx
    const gainNode = ctx.createGain()
    gainNode.gain.value = 0

    const url = '/audio/tone-samples.mp3'

    const track = { gainNode, url }

    vm.play = function (){
      vm.playing = true
      audioService.getData(track);
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

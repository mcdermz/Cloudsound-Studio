(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
      bindings: {
        trackName: '@'
      },
    })

  controller.$inject = ['socketService', 'audioService', '$state', '$scope']

  function controller(socketService, audioService, $state, $scope) {
    const vm = this
    const socket = socketService.socket
    const ctx = audioService.ctx
    const gainNode = ctx.createGain()
    gainNode.gain.value = 0

    const url = '/audio/tone-samples.mp3'

    const track = { gainNode, url }

    vm.$onInit = function() {

    }
    
    socket.on('play track', function(msg){
      $scope.$apply(function() {
        vm.play()
      })
    })

    socket.on('stop track', function(msg){
      $scope.$apply(function() {
        vm.stop()
      })
    })

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

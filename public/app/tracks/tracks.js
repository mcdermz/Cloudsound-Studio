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
    vm.gainNode = ctx.createGain()
    vm.gainNode.gain.value = 0.5
    const url = '/audio/tone-samples.mp3'
    const track = { gainNode: vm.gainNode, url }

    vm.$onInit = function() {
      const canvases = document.querySelectorAll('.visualizer')
      canvases.forEach(canvas => {
        visualizerService.canvasInit(canvas)
      })
      track.trackName = vm.trackName
    }

    socket.on('play track', function(msg){
      play()
    })

    socket.on('stop track', function(msg){
      stop()
    })

    socket.on('receive fader level', function(msg){
      if (msg.track === vm.trackName){
        vm.gainNode.gain.value = (vm.isMuted) ? 0 : msg.fader/100
        vm.fader = msg.fader
      }
    })

    const play = function (){
      audioService.getData(track)
      track.source.start(0)
      vm.gainNode.gain.value = vm.fader/100
    }

    const stop = function (){
      vm.gainNode.gain.value = 0
      track.source.stop(ctx.currentTime + 0.1)
    }
  }
})()

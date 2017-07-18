(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
      bindings: {
        trackName: '@',
        srcAudioUrl: '@'
      },
    })

  controller.$inject = ['socket', 'audioService', 'visualizerService', 'trackService', '$state', '$scope']

  function controller(socket, audioService, visualizerService, trackService, $state, $scope) {
    const vm = this
    const ctx = audioService.ctx
    vm.gainNode = ctx.createGain()
    vm.gainNode.gain.value = 0.5
    let url
    const track = { gainNode: vm.gainNode, url }

    vm.$onInit = function() {
      const canvases = document.querySelectorAll('.visualizer')
      canvases.forEach(canvas => {
        visualizerService.canvasInit(canvas)
      })
      track.trackName = vm.trackName
      track.url = vm.srcAudioUrl
    }

    socket.on('play track', function(msg){
      play()
    })

    socket.on('stop track', function(msg){
      stop()
    })

    socket.on('receive fader level', function(msg){
      if (msg.track === vm.trackName){
        vm.gainNode.gain.value = (trackService.isMuted) ? 0 : msg.fader/100
        vm.fader = msg.fader
      }
    })

    const play = function (){
      audioService.getData(track)
      vm.gainNode.gain.value = (trackService.isMuted || trackService.isMutedBySolo) ? 0 : vm.fader/100
    }

    const stop = function (){
      vm.gainNode.gain.value = 0
      track.source.stop(ctx.currentTime + 0.1)
    }
  }
})()

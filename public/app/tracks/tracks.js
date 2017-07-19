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

  controller.$inject = ['socket', 'audioService', 'visualizerService', 'tracksService', '$state', '$scope']

  function controller(socket, audioService, visualizerService, tracksService, $state, $scope) {
    const vm = this
    const ctx = audioService.ctx
    vm.gainNode = ctx.createGain()

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
      if (msg.trackName === vm.trackName){
        getData(msg)
      }
    })

    const getData = function(data) {
      vm.trackName = data.trackName
      vm.isMuted = data.isMuted
      vm.isMutedBySolo = (data.isMutedBySolo && !data.isSoloed)
      vm.isSoloed = data.isSoloed
      vm.fader = data.fader
      vm.gainNode.gain.value = (data.isMuted || data.isMutedBySolo) ? 0 : data.fader/100
    }

    const play = function (){
      audioService.getData(track)
      vm.gainNode.gain.value = (vm.isMuted || vm.isMutedBySolo) ? 0 : vm.fader/100
      track.source.start()
    }

    const stop = function (){
      vm.gainNode.gain.value = 0
      track.source.stop(ctx.currentTime + 0.1)
    }
  }
})()

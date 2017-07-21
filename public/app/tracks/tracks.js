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

  controller.$inject = ['socket', 'audioService', 'visualizerService', 'tracksService', 'studioService']

  function controller(socket, audioService, visualizerService, tracksService, studioService) {
    const vm = this
    const ctx = audioService.ctx
    vm.gainNode = ctx.createGain()
    vm.gainNode.gain.value = 0.5

    let url
    const track = { gainNode: vm.gainNode, url }

    vm.$onInit = async function() {
      const canvases = document.querySelectorAll('.visualizer')
      canvases.forEach(canvas => {
        visualizerService.canvasInit(canvas)
      })
      track.trackName = vm.trackName
      track.url = vm.srcAudioUrl
      vm.source = tracksService.sourceDisplayName(vm.srcAudioUrl)

      studioService.getAvailableTracks().then(samples => {
        vm.samples = samples.map(sample => {
          return tracksService.sourceDisplayName(sample)
        })
      })
      .catch(err => {
        console.error(err);
      })

      audioService.getData(track)
    }

    const getData = function(data) {
      tracksService.getTrackData(vm, data)
    }

    const play = function (){
      return function() {
        track.source.start()
      }
    }

    const stop = function (){
      return function() {
        vm.gainNode.gain.value = 0
        track.source.stop(ctx.currentTime + 0.1)
        audioService.getData(track)
      }
    }

    const receiveFaderLevel = function() {
      return function(msg){
        if (msg.trackName === vm.trackName){
          getData(msg)
        }
      }
    }

    socket.on('play track', play())
    socket.on('stop track', stop())
    socket.on('receive fader level', receiveFaderLevel())
  }
})()

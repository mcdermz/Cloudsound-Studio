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


    let url
    const track = { url }

    const setData = function() {
      return tracksService.setTrackData(vm)
    }

    const getData = function(data) {
      tracksService.getTrackData(vm, data, track)
    }

    vm.$onInit = async function() {
      // establish blank canvas
      const canvases = document.querySelectorAll('.visualizer')
      canvases.forEach(canvas => { visualizerService.canvasInit(canvas) })

      // format source audio names and prepare available sample selections
      vm.source = tracksService.sourceDisplayName(vm.srcAudioUrl)
      try {
        let samples = await studioService.getAvailableTracks()
        vm.samples = samples.map(sample => tracksService.sourceDisplayName(sample))
      }
      catch(err) {
        console.error(err);
      }

      // preload sample so playback begins immediately on play()
      track.trackName = vm.trackName
      track.url = vm.srcAudioUrl
      vm.is8Track = true
      audioService.getData(track)
      vm.gainNode = track.gainNode
    }

    vm.changeSource = function(sample) {
      const data = setData()
      data.sampleUrl = sample.url
      socket.emit('change track source', data)
    }

    const changeSource = function() {
      return function(msg){
        if (msg.trackName === vm.trackName){
          getData(msg)
          vm.srcAudioUrl = msg.sampleUrl
          vm.$onInit()
        }
      }
    }

    const play = function (){
      return function(msg) {
        if (msg.trackName === vm.trackName) {
          getData(msg)
          track.source.start()
        }
      }
    }

    const stop = function (){
      return function(msg) {
        if (msg.trackName === vm.trackName) {
          vm.gainNode.gain.value = 0
          try {
            track.source.stop(ctx.currentTime + 0.1)
          }
          finally {
            setTimeout(() => {
              audioService.getData(track)
            }, 700)
          }
        }
      }
    }

    const receiveFaderLevel = function() {
      return function(msg) {
        if (msg.trackName === vm.trackName){
          getData(msg)
        }
      }
    }

    socket.on('receive source change', changeSource())
    socket.on('play track', play())
    socket.on('stop track', stop())
    socket.on('receive fader level', receiveFaderLevel())
  }
})()

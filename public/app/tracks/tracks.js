(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
      bindings: {
        trackName: '@'
      },
    })

  controller.$inject = ['socket', 'audioService', '$state', '$scope']

  function controller(socket, audioService, $state, $scope) {
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
      vm.trackId = vm.trackName
      var canvas = document.querySelector(`[data-track='${vm.trackId}']`);
      console.log(canvas);
      var canvasCtx = canvas.getContext("2d");

      var intendedWidth = document.querySelector('.wrapper').clientWidth;

      canvas.setAttribute('width',intendedWidth);

      var drawVisual


      vm.visualize = function() {

        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;

        var dataArray = new Float32Array(bufferLength);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        function draw() {
          drawVisual = requestAnimationFrame(draw);

          analyser.getFloatFrequencyData(dataArray);

          canvasCtx.fillStyle = 'rgb(0, 0, 0)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          var barWidth = (WIDTH / bufferLength) * 2.5;
          var barHeight;
          var x = 0;

          for(var i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] + 140)*2;

            canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
            canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

            x += barWidth + 1;
          };
        }

        draw();
      }

      vm.visualize()
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
      vm.visualize()
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

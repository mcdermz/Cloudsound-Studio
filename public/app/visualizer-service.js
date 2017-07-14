(function (){
  'use strict';

  angular.module('app')

    .service('visualizerService', service)

    function service() {
      this.visualizeTrack = function(track) {
        visualize(track)
      }

      this.canvasInit = function(canvas){
        canvasInit(canvas)
      }
    }

    function canvasInit(canvas) {
      const canvasCtx = canvas.getContext("2d")
      const intendedWidth = document.querySelector('.wrapper').clientWidth;
      canvas.setAttribute('width',intendedWidth)
      const WIDTH = canvas.width
      const HEIGHT = canvas.height
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      return { canvasCtx, WIDTH, HEIGHT }
    }

    function visualize(track) {
      const canvas = document.querySelector('#'+ track.trackName)
      const ctx = canvasInit(canvas)
      const analyser = track.analyser
      analyser.fftSize = 256;
      let bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let drawVisual
      draw();

      function draw() {
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        ctx.canvasCtx.fillRect(0, 0, ctx.WIDTH, ctx.HEIGHT);

        let barWidth = (ctx.WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for(var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i]/2;

          ctx.canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
          ctx.canvasCtx.fillRect(x,ctx.HEIGHT-barHeight/2,barWidth,barHeight/2);

          x += barWidth + 1;
        };
      }
    }

})()

(function (){
  'use strict';

  angular.module('app')

    .service('visualizerService', service)

    function service() {
      this.visualizeTrack = function(track) {
        visualize(track)
      }
    }

    function visualize(track) {
      const analyser = track.analyser
      const canvas = document.querySelector('#'+ track.trackName)
      const canvasCtx = canvas.getContext("2d");
      const intendedWidth = document.querySelector('.wrapper').clientWidth;
      let drawVisual

      canvas.setAttribute('width',intendedWidth);
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      analyser.fftSize = 256;
      let bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      draw();

      function draw() {
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        let barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for(var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i]/2;

          canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
          canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

          x += barWidth + 1;
        };
      }
    }

})()

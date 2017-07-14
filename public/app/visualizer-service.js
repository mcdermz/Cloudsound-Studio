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
      var analyser = track.analyser
      var canvas = document.querySelector('#'+ track.trackName)
      var canvasCtx = canvas.getContext("2d");
      var intendedWidth = document.querySelector('.wrapper').clientWidth;
      var drawVisual

      canvas.setAttribute('width',intendedWidth);
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      analyser.fftSize = 256;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Float32Array(bufferLength);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      draw();
      
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
    }

})()

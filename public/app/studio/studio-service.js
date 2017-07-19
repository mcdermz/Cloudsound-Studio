(function (){
  'use strict'

  angular.module('app')
  .service('studioService', service)

  service.$inject = []

  function service(){
    this.trackNames = [{
        name: 'one',
        srcAudioUrl: 'https://s3-us-west-2.amazonaws.com/cloudsoundstudio/drums/80s-back-beat-01.mp3'
      },
      {
        name: 'two',
        srcAudioUrl: 'https://s3-us-west-2.amazonaws.com/cloudsoundstudio/bass/british-blues-bass.mp3'
      },
      {
        name: 'three',
        srcAudioUrl: 'https://s3-us-west-2.amazonaws.com/cloudsoundstudio/rhythm/disco-delight-clav.mp3'
      },
      {
        name: 'four',
        srcAudioUrl: 'https://s3-us-west-2.amazonaws.com/cloudsoundstudio/rhythm/drop-the-funk-lead-guitar.mp3'
      }
    ]
    this.soloedTracks = 0
    this.onOccupy = function(controller, parameter, bool) {
      return function(msg) {
        if (msg.track === controller.trackName && msg.parameter === parameter){
          controller.isOccupied = bool
        }
      }
    }
  }
})()

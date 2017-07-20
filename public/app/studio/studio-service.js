(function (){
  'use strict'

  angular.module('app')
  .service('studioService', service)

  service.$inject = ['$http']

  function service($http){
    this.trackNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
    this.presetTracks = {
      'one': {
        name: 'one',
        srcAudioUrl: 'drums/80s-back-beat-01.mp3'
      },
      'two': {
        name: 'two',
        srcAudioUrl: 'bass/british-blues-bass.mp3'
      },
      'three': {
        name: 'three',
        srcAudioUrl: 'rhythm/disco-delight-clav.mp3'
      },
      'four': {
        name: 'four',
        srcAudioUrl: 'rhythm/drop-the-funk-lead-guitar.mp3'
      },
      'five': {
        name: 'five',
        srcAudioUrl: 'ktb/airy-vox-synth.mp3'
      },
      'six': {
        name: 'six',
        srcAudioUrl: 'ktb/crosstown-disco-piano.mp3'
      },
      'seven': {
        name: 'seven',
        srcAudioUrl: 'ktb/stone-cold-warped-piano.mp3'
      },
      'eight': {
        name: 'eight',
        srcAudioUrl: 'ktb/70s-electric-piano-28.mp3'
      }
    }
    
    this.soloedTracks = 0
    this.onOccupy = function(controller, parameter, bool) {
      return function(msg) {
        if (msg.trackName === controller.trackName && msg.parameter === parameter){
          controller.isOccupied = bool
        }
      }
    }

    this.baseUrl = 'https://s3-us-west-2.amazonaws.com/cloudsoundstudio/'
    this.getAvailableTracks = async function() {
      const x2js = new X2JS();
      const getTracksPkg = {
        method: 'GET',
        url: this.baseUrl,
      }
      const availableTracksXml = await $http(getTracksPkg)
      const availableTracksJSON = x2js.xml_str2json(availableTracksXml.data)
      const bucketContents = availableTracksJSON.ListBucketResult.Contents
      const availableTracks = bucketContents.filter(obj => obj.Size !== '0').map(obj => obj.Key);
      return availableTracks
    }
  }
})()

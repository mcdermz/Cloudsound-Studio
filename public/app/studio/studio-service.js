(function (){
  'use strict'

  angular.module('app')
  .service('studioService', service)

  service.$inject = []

  function service(){
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

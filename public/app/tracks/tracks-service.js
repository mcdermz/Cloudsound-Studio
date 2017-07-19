(function (){
  'use strict'

  angular.module('app')
  .service('tracksService', service)

  service.$inject = []

  function service(){
    this.muteState = {}
    // this.isMutedBySolo = false
  }
})()

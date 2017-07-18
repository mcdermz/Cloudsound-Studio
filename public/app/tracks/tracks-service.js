(function (){
  'use strict'

  angular.module('app')
  .service('trackService', service)

  service.$inject = []

  function service(){
    this.isMuted = false
    this.isMutedBySolo = false
  }
})()

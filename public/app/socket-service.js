(function (){
  'use strict';

  angular.module('app')

    .service('socketService', service)

    service.$inject = []

    function service(){
      this.socket = io()
      this.socket.on('welcome', function(data){
        console.log(data);

      })
    }
})()

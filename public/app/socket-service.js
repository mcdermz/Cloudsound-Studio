
(function (){
  'use strict';

  angular.module('app')

    .service('socketService', service)

    service.$inject = ['socket']

    function service(socket){
      const socket = socket.io('http://localhost');
      socket.on('welcome', function(data){
        console.log(data);
      })
    }
})()

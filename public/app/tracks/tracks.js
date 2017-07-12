(function (){
  angular.module('app')
    .component('tracks', {
      controller: controller,
      templateUrl: './app/tracks/tracks.html',
    })

  controller.$inject = ['socketService', '$state']
  function controller(socketService, $state) {
    const vm = this
    const socket = socketService.socket
  }
})()

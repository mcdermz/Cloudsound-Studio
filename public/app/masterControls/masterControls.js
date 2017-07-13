(function (){
  angular.module('app')
    .component('masterControls', {
      controller: controller,
      templateUrl: './app/masterControls/masterControls.html',
    })

  controller.$inject = ['socketService', 'audioService', '$state', '$scope']

  function controller(socketService, audioService, $state, $scope) {
    const vm = this
    const socket = socketService.socket
    const roomName = $state.params.room

    vm.sendPlayMessage = function (){
      socket.emit('play track', roomName)
    }

    vm.sendStopMessage = function (){
      socket.emit('stop track', roomName)
    }
  }
})()

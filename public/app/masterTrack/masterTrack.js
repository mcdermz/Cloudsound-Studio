(function (){
  angular.module('app')
    .component('masterTrack', {
      controller: controller,
      templateUrl: './app/masterTrack/masterTrack.html',
    })

  controller.$inject = ['socket', 'audioService', '$state', '$scope']

  function controller(socket, audioService, $state, $scope) {
    const vm = this
    const roomName = $state.params.room

    vm.sendPlayMessage = function (){
      socket.emit('play track', roomName)
    }

    vm.sendStopMessage = function (){
      socket.emit('stop track', roomName)
    }
  }
})()

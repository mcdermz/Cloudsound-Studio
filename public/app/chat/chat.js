(function (){
  angular.module('app')
    .component('chat', {
      controller: controller,
      templateUrl: './app/chat/chat.html',
    })

  controller.$inject = ['socketService', '$state', '$scope']

  function controller(socketService, $state, $scope) {
    const vm = this
    const socket = socketService.socket
    const roomName = $state.params.room

    vm.chatMessages = []

    vm.keyup = function() {
      if (event.key === 'Enter') {
        vm.sendChat()
      }
    }

    vm.sendChat = function(){
      const msg = vm.msg
      socket.emit('sent-message', {room: roomName, msg})
      vm.msg = ''
    }

    socket.on('received-message', function(received){
      $scope.$apply(function() {
        vm.chatMessages.push({message: received})
      })
    })
  }
})()

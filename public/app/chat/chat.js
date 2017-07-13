(function (){
  angular.module('app')
    .component('chat', {
      controller: controller,
      templateUrl: './app/chat/chat.html',
    })

  controller.$inject = ['socket', '$state', '$scope']

  function controller(socket, $state, $scope) {
    const vm = this
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
      vm.chatMessages.push({message: received})
    })

    socket.on('room created', function(msg) {
      vm.chatMessages.push({message: msg})
    })
  }
})()

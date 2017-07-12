(function (){
  angular.module('app')
    .component('chat', {
      controller: controller,
      templateUrl: './app/chat/chat.html',
    })

  controller.$inject = ['socketService', '$state']

  function controller(socketService, $state) {
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
      socket.emit('chat message', {room: roomName, msg})
      vm.msg = ''
    }

    socket.on('chat message', function(msg){
      vm.chatMessages.push(msg)
      console.log('server says: ', msg);
    })
  }
})()

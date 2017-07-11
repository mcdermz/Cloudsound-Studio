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
    window.socket = socket
    vm.sendChat = function (msg){
      console.log(msg);
      socket.emit('chat message', msg)
      vm.msg = ''
    }
  }
})()

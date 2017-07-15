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
        let msgContainer = document.querySelector('.content')
        console.log('top ', msgContainer.scrollTop);
      }
    }

    vm.sendChat = function(){
      if (vm.msg && vm.msg.trim() !== ''){
        const msg = vm.msg.trim()
        socket.emit('sent-message', {room: roomName, msg})
        vm.msg = ''

      }
    }

    socket.on('received-message', function(received){
      vm.chatMessages.push({message: received})
      let msgContainer = document.querySelector('.content')
      setTimeout(function(){
        msgContainer.scrollTop = msgContainer.scrollHeight - 202.25
      },10)
    })

    socket.on('room created', function(msg) {
      vm.chatMessages.push({message: msg})
    })
  }
})()

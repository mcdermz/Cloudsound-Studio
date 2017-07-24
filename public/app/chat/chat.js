(function (){
  angular.module('app')
    .component('chat', {
      controller: controller,
      templateUrl: './app/chat/chat.html',
    })

  controller.$inject = ['socket', 'studioService', '$state', '$scope']

  function controller(socket, studioService, $state, $scope) {
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

    vm.openChat = function() {
      vm.isChatOpen = !vm.isChatOpen
      document.getElementById('chat').focus()
    }

    const receivedMsg = function() {
      return function(received){
        vm.chatMessages.push({message: received})
        // let msgContainer = document.querySelector('.content')
        // setTimeout(function(){
        //   msgContainer.scrollTop = msgContainer.scrollHeight - 202.25
        // },10)
      }
    }

    const chatWelcome = function() {
      return function(msg) {
        studioService.socketId = msg.id
        vm.chatMessages.push({message: `${msg.id} has entered room: ${msg.room}`})
      }
    }

    socket.on('received-message', receivedMsg())
    socket.on('room created', chatWelcome())
  }
})()

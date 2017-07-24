(function (){
  angular.module('app')
    .component('chat', {
      controller: controller,
      templateUrl: './app/chat/chat.html',
    })

  controller.$inject = ['socket', 'studioService', '$state', '$scope']

  function controller(socket, studioService, $state, $scope) {
    const vm = this
    const room = $state.params.room
    const chatData = { room }
    vm.chatMessages = []

    vm.keyup = function() {
      if (event.key === 'Enter') {
        vm.sendChat()
        let msgContainer = document.querySelector('.content')
      }
    }

    vm.sendChat = function(){
      if (vm.msg && vm.msg.trim() !== ''){
        chatData.msg = vm.msg.trim()
        socket.emit('sent-message', chatData)
        vm.msg = ''
      }
    }

    vm.openChat = function() {
      vm.isChatOpen = !vm.isChatOpen
      document.getElementById('chat').focus()
      vm.hasNewMessage = false
    }

    const receiveId = function() {
      return function(msg) {
        chatData.id = msg.id
      }
    }

    const receiveMsg = function() {
      return function(msg) {
        if (msg.id == studioService.socketId) {
          msg.isClient = true
        }
        vm.chatMessages.push(msg)
        let msgContainer = document.querySelector('#messages')
        setTimeout(() => {
          msgContainer.scrollTop = msgContainer.scrollHeight
        },10)
        vm.hasNewMessage = true
      }
    }

    const chatWelcome = function() {
      return function(msg) {
        studioService.socketId = msg.id
        vm.chatMessages.push({msg: `${msg.id} has entered room: ${msg.room}`})
      }
    }

    socket.on('receive socket id', receiveId())
    socket.on('received-message', receiveMsg())
    socket.on('room created', chatWelcome())
  }
})()

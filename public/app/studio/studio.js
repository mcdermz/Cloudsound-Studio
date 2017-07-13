(function (){
  angular.module('app')
    .component('studio', {
      controller: controller,
      templateUrl: './app/studio/studio.html',
    })

  controller.$inject = ['socketService', '$state']
  function controller(socketService, $state) {
    const vm = this
    const socket = socketService.socket

    vm.$onInit = function(){
      const roomName = $state.params.room
      vm.createName(roomName)
    }

    vm.createName = function(name){
      if (name){
        socket.emit('create room', name)
      }
      else {
        console.log('enter a name!');
      }
    }
  }
})()

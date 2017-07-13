(function (){
  angular.module('app')
    .component('studio', {
      controller: controller,
      templateUrl: './app/studio/studio.html',
    })

  controller.$inject = ['socket', '$state']
  function controller(socket, $state) {
    const vm = this

    vm.$onInit = function(){
      const roomName = $state.params.room
      vm.createRoom(roomName)
    }

    vm.createRoom = function(name){
      if (name){
        socket.emit('create room', name)
      }
      else {
        console.log('enter a name!');
      }
    }
  }
})()

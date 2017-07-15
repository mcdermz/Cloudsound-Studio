(function (){
  angular.module('app')
    .component('studio', {
      controller: controller,
      templateUrl: './app/studio/studio.html',
    })

  controller.$inject = ['socket', 'visualizerService', '$state']
  function controller(socket, visualizerService, $state) {
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

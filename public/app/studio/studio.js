(function (){
  angular.module('app')
    .component('studio', {
      controller: controller,
      templateUrl: './app/studio/studio.html',
    })

  controller.$inject = ['socket', 'visualizerService', 'studioService', '$state']
  function controller(socket, visualizerService, studioService, $state) {
    const vm = this

    vm.$onInit = function(){
      const roomName = $state.params.room
      vm.createRoom(roomName)
      vm.trackNames4 = studioService.trackNames.slice(0, 4);
      vm.trackNames8 = studioService.trackNames.slice(4)

      console.log('First four: ', vm.trackNames4);
      console.log('Last four: ', vm.trackNames8);
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

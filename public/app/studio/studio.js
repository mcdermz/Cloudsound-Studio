(function (){
  angular.module('app')
    .component('studio', {
      controller: controller,
      templateUrl: './app/studio/studio.html',
    })

  controller.$inject = ['socket', 'visualizerService', 'studioService', '$state']
  function controller(socket, visualizerService, studioService, $state) {
    const vm = this
    const room = $state.params.room

    vm.$onInit = async function(){
      vm.createRoom(room)
      vm.trackNames4 = studioService.trackNames.slice(0, 4);
      vm.trackNames8 = studioService.trackNames.slice(4)
      vm.trackData = studioService.presetTracks
      vm.getTracks = await studioService.getAvailableTracks()
    }

    vm.createRoom = function(name){
      if (name){
        socket.emit('create room', name)
      }
      else {
        console.log('enter a name!');
      }
    }

    vm.eightTrackToggle = function() {
      const is8Track = vm.is8Track || false
      const data = { room, is8Track }
      socket.emit('8 track toggle', data)
    }

    socket.on('8 track toggle', function(msg) {
      vm.is8Track = msg.is8Track
    })
  }
})()

(function (){
  angular.module('app')
    .component('faders', {
      controller: controller,
      templateUrl: './app/tracks/faders/faders.html',
      bindings: {
        trackName: '@',
        fader: '='
      },
    })

  controller.$inject = ['socket', '$state']

  function controller(socket, $state){
    const vm = this

    vm.faderChange = function() {
      const data = {
        room: $state.params.room,
        track: vm.trackName,
        level: vm.fader
      }
      socket.emit('send fader level', data)
    }
  }
})()

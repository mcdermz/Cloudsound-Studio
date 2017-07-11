(function (){
  angular.module('app')
    .component('splash', {
      controller: controller,
      templateUrl: './app/splash/splash.html',
    })

  controller.$inject = ['socketService']

  function controller(socketService) {
    const vm = this
    const socket = socketService.socket

    vm.foo = 'SPLASH'

    vm.createName = function(name){
      if (name){
        console.log(name);
        socket.emit('create room', name)
        vm.roomName = ''
      }
      else {
        console.log('enter a name!');
      }
    }

    vm.keyup = function(event) {
      if (event.key === 'Enter') vm.createName(vm.roomName)
    }
  }
})()

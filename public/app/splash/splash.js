(function (){
  angular.module('app')
    .component('splash', {
      controller: controller,
      templateUrl: './app/splash/splash.html',
    })

  function controller() {
    const vm = this

    vm.foo = 'SPLASH'

    const socket = io('http://localhost');
    vm.createName = function(name){
      if (name){
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

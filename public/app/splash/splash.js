(function (){
  angular.module('app')
    .component('splash', {
      controller: controller,
      templateUrl: './app/splash/splash.html',
    })

  controller.$inject = ['socket', '$state']

  function controller(socket, $state) {
    const vm = this

    socket.on('welcome', function(msg) {
      console.log(msg)
    })

    vm.$onInit = function() {
      vm.roomName = ''
    }

    vm.keyup = function(event) {
      if (event.key === 'Enter') {
        $state.go('studio', {room: vm.roomName})
      }
    }
  }
})()

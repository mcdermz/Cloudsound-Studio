(function (){
  angular.module('app')
    .component('splash', {
      controller: controller,
      templateUrl: './app/splash/splash.html',
    })

  controller.$inject = ['socketService', '$state']

  function controller(socketService, $state) {
    const vm = this
    
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

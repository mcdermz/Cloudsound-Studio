(function (){
  angular.module('app')
    .component('chat', {
      controller: controller,
      templateUrl: './app/chat/chat.html',
    })

  controller.$inject = ['socketService', '$state']

  function controller(socketService, $state) {
    const vm = this
  }
})()

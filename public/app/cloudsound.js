(function (){
  angular.module('app')

    .component('cloudsound', {

      controller: controller,
      templateUrl: './app/cloudsound.html',
    })

  function controller() {
    const vm = this

    var socket = io('http://localhost');
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });

    vm.foo = 'yo0hoo'
  }
})()

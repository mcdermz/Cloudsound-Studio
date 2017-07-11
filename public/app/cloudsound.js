(function (){
  angular.module('app')

    .component('cloudsound', {

      controller: controller,
      templateUrl: './app/cloudsound.html',
    })

  function controller() {
    const socket = io('http://localhost');
    socket.on('welcome', function(data){
      console.log(data);
    })
  }
})()

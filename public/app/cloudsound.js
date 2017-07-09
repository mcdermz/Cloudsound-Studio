(function (){
  angular.module('app')

    .component('cloudsound', {

      controller: controller,
      templateUrl: './app/cloudsound.html',
    })

  function controller() {
    const vm = this

    vm.foo = 'yo0hoo'
  }
})()

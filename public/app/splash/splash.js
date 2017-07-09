(function (){
  angular.module('app')

    .component('splash', {

      controller: controller,
      templateUrl: './app/splash/splash.html',
    })

  function controller() {
    const vm = this

    vm.foo = 'SPLASH'
  }
})()

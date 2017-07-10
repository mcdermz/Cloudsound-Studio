console.log('sanity studio');
(function (){
  angular.module('app')
    .component('studio', {
      controller: controller,
      templateUrl: './app/studio/studio.html',
    })

  function controller() {
    const vm = this

    vm.foo = 'STUDIO'
  }
})()

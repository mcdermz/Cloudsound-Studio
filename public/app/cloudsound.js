angular.module('app')

  .component('cloudsound', {

    controller: function () {
      const vm = this

      vm.foo = 'yo'
    },
    templateUrl: './app/cloudsound.html',
  })

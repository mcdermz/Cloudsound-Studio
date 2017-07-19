(function (){
  'use strict';

  angular.module('app')
  .factory('socket', factory)

  function factory(socketFactory) {
    return socketFactory({
      prefix: '',
      ioSocket: io.connect()
    });
  }
})()

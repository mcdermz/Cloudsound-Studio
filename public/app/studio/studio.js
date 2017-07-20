(function (){
  angular.module('app')
    .component('studio', {
      controller: controller,
      templateUrl: './app/studio/studio.html',
    })

  controller.$inject = ['socket', 'visualizerService', 'studioService', '$state', '$http']
  function controller(socket, visualizerService, studioService, $state, $http) {
    const vm = this
    const room = $state.params.room

    vm.$onInit = async function(){
      vm.createRoom(room)
      vm.trackNames4 = studioService.trackNames.slice(0, 4);
      vm.trackNames8 = studioService.trackNames.slice(4)

      vm.getTracks = await getAvailableTracks()
      console.log(vm.getTracks);
    }

    vm.createRoom = function(name){
      if (name){
        socket.emit('create room', name)
      }
      else {
        console.log('enter a name!');
      }
    }

    vm.eightTrackToggle = function() {
      const is8Track = vm.is8Track || false
      const data = { room, is8Track }
      socket.emit('8 track toggle', data)
    }

    const getAvailableTracks = async function() {
      const x2js = new X2JS();
      const getTracksPkg = {
        method: 'GET',
        url: 'https://s3-us-west-2.amazonaws.com/cloudsoundstudio',
      }
      const availableTracksXml = await $http(getTracksPkg)
      const availableTracksJSON = x2js.xml_str2json(availableTracksXml.data)
      const bucketContents = availableTracksJSON.ListBucketResult.Contents
      const availableTracks = bucketContents.filter(obj => obj.Size !== '0').map(obj => obj.Key);
      return availableTracks
    }

    socket.on('8 track toggle', function(msg) {
      vm.is8Track = msg.is8Track
    })
  }
})()

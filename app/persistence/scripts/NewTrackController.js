angular
  .module('persistence')
  .controller('NewTrackController', function($scope, supersonic) {
    // Controller functionality here
    $scope.newTrack = {
      name: "",
      data: []
    };

    $scope.track = function(){
      console.log('Tracking');
      console.log($scope.newTrack);
      supersonic.data.channel('new_tracks').publish($scope.newTrack);
      $scope.newTrack.name = "";
      supersonic.ui.tabs.select(0);
    }
  });

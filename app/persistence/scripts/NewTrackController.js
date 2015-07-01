angular
  .module('persistence')
  .controller('NewTrackController', function($scope, supersonic) {
    // Controller functionality here
    $scope.track = {
      name: "",
      data: []
    };

    $scope.trackPressed = function(){
    }
  });

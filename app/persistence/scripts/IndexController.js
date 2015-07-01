angular
  .module('persistence')
  .controller('IndexController', function($scope, supersonic) {
    // Controller functionality here
    $scope.tracks = [{
      name: "Exercise",
      data: [{
        t: 1435708683257,
      },{
        t: 1435608683257,
      },{
        t: 1435508683257,
      },{
        t: 1435408683257,
      },{
        t: 1433308683257,
      }]
    }];

    $scope.findTrack = function(name){
      $scope.tracks.forEach(function(repeaterTrack){
        if(name === repeaterTrack.name){
          return repeaterTrack;
        }
      })
    }

    $scope.do = function(DOMtrack){
      var realTrack = findTrack(DOMtrack.name); // we need a reference to the one in the repeater
      var point = {
        t: new Date().valueOf(),
      }
      realTrack.data.unshift(point); // add to front
    }

    $scope.countDayStreak = function(data){
      var dayMs = 1000 * 60 * 60 * 24;
      var streak = 0;

      var now = new Date();
      var lastMidnight = new Date(now);
      lastMidnight.setHours(0);
      lastMidnight.setMinutes(0);
      lastMidnight = lastMidnight.valueOf();

      var countedToday = false; // have we already counted an earlier datapoint today?

      // Loop through all data points until we find a day with no datapoint timestamp
      // Front of array should be most recent
      for(var i=0; i<data.length; i++){
        var point = data[i];
        if(point.t > lastMidnight && !countedToday){
          streak += 1;
          // we don't want to double count a day if there are multiple datapoints:
          countedToday = true;
        } else if(point.t < lastMidnight){
          if(!countedToday){
            // We hit a point before midnight, without seeing a data point today.
            return streak;
          } else {
            // We rolled over to a datapoint from some previous day
            var delta = lastMidnight - point.t;
            if(delta > dayMs){
              // More than a day between datapoints. End the streak.
              return streak;
            } else {
              // The datapoint was from yesterday. Adjust midnight and reset the flag:
              streak += 1;
              lastMidnight -= dayMs;
              countedToday = true;
            }
          }
        }
      }
      // Got through all data points without a 24 hour gap. Nice work.
      return streak;
    }
  });

angular
  .module('persistence')
  .controller('IndexController', function($scope, supersonic) {
    var dayMs = 1000 * 60 * 60 * 24;

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
    }, {
      name: "Duolingo",
      data: []
    }
    ];

    supersonic.data.channel('new_tracks').subscribe(function(newTrack){
      console.log('Got new track:');
      console.log(newTrack);
      $scope.tracks.unshift(newTrack);
      $scope.$apply();
    });

    $scope.findTrack = function(name){
      $scope.tracks.forEach(function(repeaterTrack){
        if(name === repeaterTrack.name){
          return repeaterTrack;
        }
      })
    }

    $scope.do = function(DOMtrack){
      //var realTrack = findTrack(DOMtrack.name); // we need a reference to the one in the repeater
      var point = {
        t: new Date().valueOf(),
      }
      DOMtrack.data.unshift(point); // add to front
    }

    $scope.tsLastMidnight = function(){
      var lastMidnight = new Date();
      lastMidnight.setHours(0);
      lastMidnight.setMinutes(0);
      return lastMidnight.valueOf();
    }

    $scope.tsNow = function(){
      var now = new Date();
      return now.valueOf();
    }

    $scope.doneToday = function(DOMtrack){
      var n = DOMtrack.data.length;
      if(n === 0){
        return false;
      }
      var earliest = $scope.tsLastMidnight();
      // Check the most recent data point:
      if(DOMtrack.data[0].ts < earliest){
        return false;
      } else {
        return true;
      }

    }

    $scope.countDayStreak = function(data){
      var streak = 0;
      var lastMidnight = $scope.tsLastMidnight();

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

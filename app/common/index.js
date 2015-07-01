angular.module('common', [
  // Declare here all AngularJS dependencies that are shared by all modules.
  'supersonic'
])
.filter('momentPretty', function(){
  return function(ts){
    return moment(ts).fromNow();
  }
})

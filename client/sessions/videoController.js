myApp.controller('VideoController', ['$scope', '$routeParams', 'Video', '$location', function($scope, $routeParams, Video, $location){
  angular.extend($scope, Video);
  

  $scope.initialize = function() {
    $scope.getSession($scope.session.id)
      .then(function(res){
        $scope.webrtc = $scope.setupConf('local-video', 'remote-video');
        $scope.callConf($scope.webrtc, $scope.session.id);
        $scope.session = res.data.session;
        }
      })
      .catch(function (error) {
        $location.path('/');
      })
    
  };
  $scope.session = {
    id: $routeParams.sessionId
  };
  $scope.initialize();

}]);
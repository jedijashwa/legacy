myApp.controller('VideoController', ['$scope', '$routeParams', 'Video', function($scope, $routeParams, Video){
  angular.extend($scope, Video);
  

  $scope.initialize = function() {
    $scope.getSession($scope.session.id)
      .then(function(res){
        if (res.err) {
          console.log(res.err);
        } else {
          console.log('res: ', res);
          $scope.session = res.data.session;
          console.log($scope.session);
        }
      });
    $scope.webrtc = $scope.setupConf('local-video', 'remote-video');
    $scope.callConf($scope.webrtc, $scope.session.id);
  };
  $scope.session = {
    id: $routeParams.sessionId
  };
  $scope.initialize();

}]);
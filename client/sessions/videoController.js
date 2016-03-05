myApp.controller('VideoController', ['$rootScope', '$scope', '$routeParams', 'Video', '$location', 'Auth', function($rootScope, $scope, $routeParams, Video, $location, Auth){
  angular.extend($scope, Video, Auth);
  $scope.userId = $scope.getUserId();
  $scope.authorized = false;

  $scope.initialize = function() {
    $scope.getSession($scope.session.id)
      .then(function(res){
        if (res.status === 401) {
          console.log('webrtc', $rootScope.webrtc);
          $rootScope.webrtc && $rootScope.webrtc.stopLocalVideo();
          $scope.setLoggedIn(false);
          $location.path('/');
          return;
        }
        if (res.data.err === 'Session not found') {
          $rootScope.webrtc && $rootScope.webrtc.stopLocalVideo();
          $location.path('/');
          return;
        }
        $rootScope.webrtc = $scope.setupConf('local-video', 'remote-video');
        $scope.callConf($rootScope.webrtc, $scope.session.id);
        $scope.session = res.data.session;
      })
      .catch(function (error) {
        $rootScope.webrtc && $rootScope.webrtc.stopLocalVideo();
        $location.path('/');
      }); 
  };
  $scope.session = {
    id: $routeParams.sessionId
  };
  $scope.initialize();

}]);
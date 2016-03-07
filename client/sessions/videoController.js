myApp.controller('VideoController', ['$rootScope', '$scope', '$routeParams', 'Video', '$location', 'Auth', function($rootScope, $scope, $routeParams, Video, $location, Auth){
  angular.extend($scope, Video, Auth);
  $scope.userId = $scope.getUserId();
  $scope.authorized = false;

  $scope.initialize = function() {
    $scope.getSession($scope.session.id)
      .then(function(res){
        if (res.status === 401) {
          console.log('webrtc', $rootScope.webrtc);
          $scope.setLoggedIn(false);
          $scope.closeConf();
          return;
        }
        if (res.data.err === 'time') {
          $scope.closeConf();
          Materialize.toast('You are either too early or too late, sorry!', 3000);
          return;
        }
        if (res.data.err === 'Session not found') {
          $scope.closeConf();
          return;
        }
        $rootScope.webrtc = $scope.setupConf('local-video', 'remote-video');
        $scope.callConf($rootScope.webrtc, $scope.session.id);
        $scope.session = res.data.session;
      })
      .catch(function (error) {
        $scope.closeConf();
      }); 
  };
  $scope.session = {
    id: $routeParams.sessionId
  };

  $scope.closeConf = function () {
    $rootScope.webrtc && $rootScope.webrtc.stopLocalVideo();
    $location.path('/');
  };
  $scope.initialize();

}]);
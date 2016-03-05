myApp.controller('VideoController', ['$scope', '$routeParams', 'Video', '$location', 'Auth', function($scope, $routeParams, Video, $location, Auth){
  angular.extend($scope, Video, Auth);
  $scope.userId = $scope.getUserId();
  $scope.authorized = false;

  $scope.initialize = function() {
    $scope.getSession($scope.session.id)
      .then(function(res){
        console.log("User: ", $scope.userId);
        console.log("Session: ", res.data.session);
        if ($scope.userId === res.data.session.UserId || $scope.userId === res.data.session.studentId) {
          $scope.authorized = true;
        }
        if (res.status === 401 || !$scope.authorized) {
          $location.path('/');
        } else {
          $scope.webrtc = $scope.setupConf('local-video', 'remote-video');
          $scope.callConf($scope.webrtc, $scope.session.id);
          $scope.session = res.data.session;
        }
      })
      .catch(function (error) {
        console.log("In here?");
        $location.path('/');
      }); 
  };
  $scope.session = {
    id: $routeParams.sessionId
  };
  $scope.initialize();

}]);
myApp.controller('ProfileController', ['$scope', 'Auth', 'Profile', function($scope, Auth, Profile) {

  $scope.userId = Auth.getUserId();
  $scope.userName = Auth.getUserName();
  $scope.sessionTileTemplate = "/session_tile.html";

  $scope.getStudentSessions = function(){
    Profile.getStudentSessions($scope.userId)
    .then(function(studentSessions) {
      $scope.studentSessions = studentSessions.studentSessions;  
    });
  };
  $scope.getTutorSessions = function(){
    Profile.getTutorSessions($scope.userId)
    .then(function(tutorSessions) {
      $scope.tutorSessions = tutorSessions.tutorSessions;
    });
  };
  $scope.getStudentSessions();
  $scope.getTutorSessions();
}]);
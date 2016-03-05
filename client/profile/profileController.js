myApp.controller(['$scope', 'Auth', 'Profile', function($scope, Auth, Profile) {
  //need to add script to index.html
  //update routes in app.js to include profile page
  $scope.userId = Auth.getUserId();


  $scope.getStudentSessions = function(){
    Profile.getStudentSessions($scope.userId)
    .then(function(studentSessions) {
      $scope.studentSessions = studentSessions  
    });
  };
  $scope.getTutorSessions = function(){
    Profile.getTutorSessions($scope.userId)
    .then(function(tutorSessions) {
      $scope.tutorSessions = tutorSessions  
    });
  };
  $scope.getStudentSessions();
  $scope.getTutorSessions();
}]);
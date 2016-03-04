
// invokes function from mainFactory.js to sign in a user
myApp.controller('SigninController', function ($scope, Auth, $window) {
  $scope.user = {};
  $scope.failed = null;
  $scope.signin = function (user) {
    Auth.signin(user).then(function (user){
      console.log("User: ", user);
        if (!user) {
          $scope.failed = true;
          return;
        } else {
          $scope.failed = false;
          Auth.setLoggedIn(true);
        // redirect
          $window.location.href = '/#/create';
        }
        
    });
  };
});

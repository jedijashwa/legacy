//determine which sign-in/sign-out buttons appear in index.html
myApp.controller('IndexController', function($scope, $window, Auth) {
  
  angular.extend($scope, Auth);

  $scope.auth = { signin: true, signout: false };
  $scope.categories = [
    'Programming',
    'Language',
    'Design',
    'Music',
    'Wellness',
    'Cooking'
  ];

  $scope.$on('loggedIn', function(){
    $scope.auth.signin = false;
    $scope.auth.signout = true;
  });

  $scope.signout = function(){
    Auth.signout();
    Auth.setLoggedIn(false);
    $scope.auth.signin = true;
    $scope.auth.signout = false;
  };

// initialized materialize js when view is loaded
  $scope.$on('$viewContentLoaded', function(){
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    $('select').material_select();
  });
});

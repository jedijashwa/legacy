//ngMaterial included for datepicker
var myApp = angular.module("myApp", ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'main.html',
      controller: 'SessionController'
    })
    .when('/signin', {
      templateUrl: 'auth/signin.html',
      controller: 'SigninController'
    })
    .when('/signup', {
      templateUrl: 'auth/signup.html',
      controller: 'SignupController'
    })
    .when('/create', {
      templateUrl: 'createSession/createSession.html',
      controller: 'CreateSessionController',
    })
    .when('/sessions/:sessionId', {
      templateUrl: 'sessions/video.html',
      controller: 'VideoController',
      video: true
    })
    .when('/profile/', {
      templateUrl: 'profile/profile.html',
      controller: 'ProfileController',
      blocked: true
    })
    .otherwise({
      redirectTo: '/'
    });
})

.run(['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {

    if (next.$$route && !next.$$route.video) {
      $rootScope.webrtc && $rootScope.webrtc.stopLocalVideo();
    }
    if (!next.$$route.blocked) {
      return;
    }
    if (!Auth.getLoggedIn()) {
      $location.path('/');
    }
  });
}]);


<<<<<<< HEAD
myApp.controller('SessionController', function ($scope, Session) {

=======
myApp.controller('SessionController', function ($scope, $http, Session) {
>>>>>>> Creates paymentTest page.
  $scope.sessionTileTemplate = "/session_tile.html";

  $scope.sessions = [];
  $scope.getSessions = function () {
    Session.getSessions()
    .then(function (sessions) {
      $scope.sessions = sessions;
    });
  };

  $scope.getSessions();
  $scope.isClicked = false;

  $scope.register = function (session, tuteeEmail){

    // send an email to user and register them
    var registerInfo = {tuteeEmail: tuteeEmail, link: session.link, topic: session.topic, tutorEmail: session.User.email};

    Session.register(registerInfo);

    // when someone registers for a session, status of session changes to true
    var updateInfo = {id: session.id, status: true };
    Session.updateStatus(updateInfo).then(function(updatedSession){
      $scope.getSessions();
    });
  };

  //logic for filtering sessions by all vs. today
  $scope.filterType = 'all';
  $scope.sessionFilter = function (session) {
    if (session.startTime) {
      var today = new Date();
      var sessionTime = new Date(session.startTime.substring(0,19));
      if ( $scope.filterType === 'all') {
        return true;
      } else if ($scope.filterType === 'day') {
        return sessionTime.getDay() === today.getDay() && sessionTime.getMonth() === today.getMonth() && sessionTime.getFullYear() === today.getFullYear();
      }
    } else {
      return true;
    }
  };
  //format time for display on session card
  $scope.displayTime = function(time) {
    time = time.substring(0,16).split('T').join(' at ');
    return time += ' PST';
  };

  $scope.getPaymentToken = function () {
    $http({
      method: 'GET',
      url: '/client_token'
    }).then(function (response) {
      console.log('client_token', response.data);
    });
  };

  $scope.getPaymentToken();
})

.controller('CreateSessionController', function ($scope, Session, Auth, $window) {
  $scope.session = {};
  $scope.myDate = new Date();

  var formatDate = function (date, time) {
    date = date.toString().split(' ');
    var months = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
    var month = months[date[1]];
    var day = date[2];
    var year = date[3];

    return year + '-' + month + '-' + day + ' ' + time;
  };

  $scope.createSession = function (session) {
    session.startTime = formatDate($scope.myDate, $scope.time);

    // attaches UserId to session instance that gets created
    Auth.getSignedInUser().then(function (user){
      session.UserId = user.data.UserId;

      Session.createSession(session).then(function(){
        // redirect
        $window.location.href = '/#/';
      });
    });

  };

  $scope.isLoggedIn = function () {
    if (Auth.getLoggedIn()){
      $scope.$emit('loggedIn');
    } else {
      // redirect
      $window.location.href = '/#/signin';
    }
  };
  $scope.isLoggedIn();
});

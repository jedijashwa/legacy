
myApp.factory('Session', function($http, $location) {
  var createSession = function(session) {
    return $http({
      method: 'POST',
      url: '/sessions',
      data: session
    })
    .then(function(session) {
      return session.data;
    });
  };
  var getSessions = function() {
    return $http({
      method: 'GET',
      url: '/sessions'
    })
    .then(function(sessions) {
      return sessions.data;
    });
  };

  // must send an object with 'id' and 'status' property 
  var updateStatus = function(updateInfo){
    console.log('clicked inside factory', updateInfo);
    return $http({
      method: 'PUT',
      url: '/sessions',
      data: updateInfo
      })
    .then(function(updatedSession){
      return updatedSession;
    });
  };
  
  var register = function(userInfo) {
    return $http({
      method: 'POST',
      url: '/sessions/send',
      data: userInfo
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
  };

  return {
    createSession: createSession,
    getSessions: getSessions,
    updateStatus: updateStatus,
    register: register
  };
});

myApp.factory('Auth', function ($http, $location, $window) {

  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signIn',
      data: user
    })
    .then(function (user) {
      return user.data;
    })
    .catch(function(err){
      console.log(err);
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/users',
      data: user
    })
    .then(function (user) {
      return user.data;
    });
  };

  var signout = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signOut',
      data: user
    })
    .then(function (user) {
      return user.data;
    });
  };
  

  var isLoggedIn = function() {
    return $http({
      method: 'GET',
      url: '/users/isLoggedIn'
    })
    .then(function(bool) {
      return bool.data;
    });
  };

  isLoggedIn().then(function(bool){
    loggedIn = bool;
  });

  var loggedIn = false;
  var userId = undefined;
  var userEmail = undefined;
  

  var getLoggedIn = function(){
    return loggedIn;
  };

  var getUserId = function () {
    return userId;
  };

  var getUserEmail = function () {
    return userEmail;
  };

  var setLoggedIn = function(bool, id, email){
    loggedIn = bool;
    if (loggedIn) {
      userId = id;
      userEmail = email;
    } else {
      userId = undefined;
      userEmail = undefined;
    }
  };

  var getSignedInUser = function () {

    return $http({
      method: 'GET',
      url: '/users/getSignedInUser'
    })
    .then(function(user) {
      return user;
    });
  };


  return {
    getSignedInUser : getSignedInUser,
    signin: signin,
    signup: signup,
    signout: signout,
    getLoggedIn: getLoggedIn,
    setLoggedIn: setLoggedIn,
    getUserId: getUserId,
    getUserEmail: getUserEmail
  };
});

myApp.factory('Video', function($http){
  var getSession = function(sessionId) {
    return $http({
      method: 'GET',
      url: '/sessions/' + sessionId
    })
    .then(function(res) {
      return res;
    });
  };

  var setupConf = function (localEl, remoteEl) {
    var webrtc = new SimpleWebRTC({
      localVideoEl: localEl,
      remoteVideosEl: remoteEl,
      autoRequestMedia: true
    });

    return webrtc;
  };

  var callConf = function (webrtc, roomname) {
    webrtc.on('readyToCall', function () {
      webrtc.joinRoom(roomname);
    });
  };

  return {
    getSession: getSession,
    setupConf: setupConf,
    callConf: callConf
  };
});








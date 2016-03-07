myApp.controller('sessionTileController', function ($scope, $http, Auth) {
// We generated a client token for you so you can test out this code
// immediately. In a production-ready integration, you will need to
// generate a client token on your server (see section below).

  angular.extend($scope, Auth)

  $scope.nonce;


  $scope.initiateReg = function () {
    //if the user is signedIn, this will load the Braintree paypal
    //card options and request the client token needed to submit payments

    if ($scope.session.free) {
      $scope.sendReg($scope.session);
    } else {
      $http({
        method: 'GET',
        url: '/client_token'
      })
      .then(function (response) {
        var clientToken = response.data;
        braintree.setup(clientToken, "dropin", {
          container: "payment-form" + $scope.session.id,
          onPaymentMethodReceived: function (payload) {
            $scope.sendReg($scope.session, payload.nonce);
          }
        });
        $scope.registration = $scope.session.id;
      });
    }
  };

  $scope.sendReg = function (session, nonce) {
    $http({
      method: 'POST',
      url: '/sessions/send',
      data: {price: session.price, id: session.id, payment_method_nonce: nonce, free: session.free, studentId: $scope.getUserId()}
    })
    .then(function (res) {
      console.log(res);
      if (res.data.session) {
        Materialize.toast('You have succesfully registered for this class!', 1750);
        session.studentId = $scope.getUserId();
        session.status = true;

      } else {
        Materialize.toast('I\'m sorry, something went wrong.', 1750);
      }
    })
    .catch(function (error) {
      Materialize.toast('I\'m sorry, something went wrong.', 1750);
    })
    .finally(function () {
      $scope.closeReg();
    });
  }

  $scope.closeReg = function () {
    $scope.registration = 0;
    $('#payment-form' + $scope.session.id).empty();
  };


});

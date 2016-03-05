myApp.controller('sessionTileController', function ($scope, $http, Auth) {
// We generated a client token for you so you can test out this code
// immediately. In a production-ready integration, you will need to
// generate a client token on your server (see section below).

  angular.extend($scope, Auth)

  $scope.nonce;
  

  $scope.initiateReg = function () {

    $http({
      method: 'GET',
      url: '/client_token'
    })
    .then(function (response) {
      var clientToken = response.data;
      braintree.setup(clientToken, "dropin", {
        container: "payment-form" + $scope.session.id,
        onPaymentMethodReceived: function (payload) {
          $http({
            method: 'POST',
            url: '/sessions/send',
            data: {price: $scope.session.price, id: $scope.session.id, payment_method_nonce: payload.nonce}
          })
        }
      });
      $scope.registration = $scope.session.id;
    });
  };

  $scope.closeReg = function () {
    $scope.registration = 0;
    $('#payment-form' + $scope.session.id).empty();
  };

});

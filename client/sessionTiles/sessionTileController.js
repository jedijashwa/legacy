myApp.controller('sessionTileController', function ($scope, $http) {
// We generated a client token for you so you can test out this code
// immediately. In a production-ready integration, you will need to
// generate a client token on your server (see section below).

  $http({
    method: 'GET',
    url: '/client_token'
  })
  .then(function (response) {
    var clientToken = response.data;
    console.log(clientToken);

    braintree.setup(clientToken, "dropin", {
      container: "payment-form" + $scope.session.id
    });
  });

});

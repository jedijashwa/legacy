var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "sqnqd3tw9zy2825y",
  publicKey: "ygfyswpbrf99qwfs",
  privateKey: "4b9a44093df61968907db87bb9319854"
});

module.exports.getClientToken = function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
};

module.exports.checkout = function (req, res) {
  console.log('here');
  var nonce = req.body.payment_method_nonce;
  var price = req.body.price;
  var id = req.body.id;
  // Use payment method nonce here
  gateway.transaction.sale({
    amount: price,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if(err) {
      console.error(err);
    } else {
      res.send({success: result.success});
    }
  });
};

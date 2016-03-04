var controller = require('./paymentsController.js');

module.exports = function (app) {
  app.get("/client_token", function (req, res) {
    controller.gateway.clientToken.generate({}, function (err, response) {
      res.send(response.clientToken);
    });
  });

  app.post("/checkout", function (req, res) {
    var nonce = req.body.payment_method_nonce;
    // Use payment method nonce here
  });
};

var controller = require('./paymentsController.js');

module.exports = function (app) {
  app.get("/client_token", controller.getClientToken);

  app.post("/checkout", controller.checkout);
};

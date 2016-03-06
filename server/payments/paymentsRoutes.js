var controller = require('./paymentsController.js');

module.exports = function (app) {
  app.get("/client_token", controller.getClientToken);
  //the route for checking out (/send) is being handled in sessionRoutes
  //and SessionController
};

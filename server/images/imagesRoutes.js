var controller = require('./imagesController.js');

module.exports = function (app){
  app.post('/images', controller.getImages);
};

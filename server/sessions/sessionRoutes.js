var sessionController = require('./sessionController.js');

module.exports = function (app){

  app.get('/', sessionController.getSessions);

  app.get('/:sessionId', sessionController.getSession);
  
  app.post('/', sessionController.checkAuth, sessionController.addSession);
  
  app.post('/send', sessionController.registerSession);
  
  app.put('/', sessionController.updateStatus);
  
  // not used, not tested
  app.delete('/', sessionController.deleteSession);
};
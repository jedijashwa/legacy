var sessionController = require('./sessionController.js');

module.exports = function (app){

  app.get('/', sessionController.getSessions);

  app.get('/:sessionId', sessionController.checkAuth, sessionController.getSession);

  app.get('/students/:userId', sessionController.checkAuth, sessionController.getStudentSessions);

  app.get('/tutors/:userId', sessionController.checkAuth, sessionController.getTutorSessions);  
  
  app.post('/', sessionController.checkAuth, sessionController.addSession);
  
  app.post('/send', sessionController.checkAuth, sessionController.registerSession);
  
  app.put('/', sessionController.updateStatus);
  
  // not used, not tested
  app.delete('/', sessionController.deleteSession);
};
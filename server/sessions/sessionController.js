var Session = require('../../db/models').Session;
var User = require('../../db/models').User;
var Mailgun = require('mailgun-js');
var config = require('../config/config');
var http = require('http-request');
var payment = require('../payments/paymentsController.js');


module.exports.addSession = function(req, res){

    
  // set the link property on req.body before passing it into Session.create
    var urlBase = 'http://localhost:3000/';
    if (process.env.NODE_ENV === 'production') {
      urlBase = 'https://tutordojo.herokuapp.com/';
    }
    var sessionInfo = req.body;
    sessionInfo.UserId = req.user.id;
    Session.create(sessionInfo).then(function (session) {
      session.link = urlBase + '#/sessions/' + session.id;
      session.save().then(function (session) {
        res.send(session);
      })
    })
    .catch(function (err) {
      res.sendStatus(401);
      console.error('Error creating session: ', err);
    });
};

module.exports.getSessions = function (req, res){
  Session.findAll({ where: req.body, include: [{model: User, as: 'User'}]}).then(function (sessions) {
    if (sessions){
      res.json(sessions);
    } else {
      ('No sessions found');
      res.end();
    }
  })
  .catch(function (err) {
    console.error('Error getting sessions: ', err);
    res.end();
  });
};

/** Retrieve session for a video conference **/
/** Request is rejected if you are not the tutor or student,
    or it is too early/late **/
module.exports.getSession = function (req, res) {
  Session.findById(req.params.sessionId).then(function (session) {
    if (session) {
      var userId = req.session.passport.user;
      if (session.UserId !== userId && session.studentId !== userId) {
        res.sendStatus(401);
        return;
      }
      if (session.startTime > Date.now() || Date.now() - session.startTime > 3600000) {
        res.send({err: 'time'});
        return;
      }
      session.me_id = req.session.passport.user;
      res.json({session: session});
    } else {
      res.json({err: "Session not found"});
    }
  })
  .catch(function(err) {
    res.send(404, {err: err});
  });
};

module.exports.getStudentSessions = function(req,res) {
  Session.findAll({ where: {studentId: req.params.userId}})
  .then(function(sessions) {
    if (sessions) {
      res.json({studentSessions: sessions});
    } else {
      res.json({err: "User has no upcoming student sessions"});
    }
  })
  .catch(function(err) {
    res.send(404, {err: err});
  });
};
module.exports.getTutorSessions = function(req,res) {
  Session.findAll({ where: {userId: req.session.passport.user}})
  .then(function(sessions) {
    if (sessions) {
      res.json({tutorSessions: sessions});
    } else {
      res.json({err: "User has no upcoming tutoring sessions"});
    }
  })
  .catch(function(err) {
    res.send(404, {err: err});
  });
};

module.exports.updateStatus = function (req, res){
  var status = req.body.status;
  var id = parseInt(req.body.id);

  Session.findById(id).then(function (session){
    session.status = status;
    session.save().then(function (){
      res.send(session);
    }).catch(function(err){
      console.log(err);
    });
  });
};

// not implemented, not tested
module.exports.deleteSession = function (req, res){
  Session.findById(req.params.id).then(function (session){
    return session.destroy();
  }).then(function(){
    console.log('Session was deleted.');
  });
};

module.exports.checkAuth = function(req, res, next) {
  console.log(req.session.passport);
  if(req.session.passport && req.session.passport.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// sends an email to both user that created session and user that registers for session
module.exports.registerSession = function(req, res) {
  var registration = function (req, res) {
    var sentInfo = req.body;
    if (req.session.passport.user !== sentInfo.studentId) {
      res.json({error: 'Error processing your request'});
      return;
    }

    Session.findById(sentInfo.id, {include: [{model: User, as: 'User'}]})
    .then(function (session){
      if (!session) {
      console.log('cheese');
        res.json({error: 'session does not exist'})
        return;
      }
      if (session.studentId) {

        res.json({error: 'full'});
        return;
      }
      session.status = true;
      session.studentId = sentInfo.studentId;
      session.save()
      .then(function (session){
        console.log(session);
        var mailgun = new Mailgun({ apiKey: config.mailGunAPIKey, domain: config.mailGunDomain });

        var data = {
          from: 'robot@tutordojo.herokuapp.com',
          to: [sentInfo.tuteeEmail, session.User.dataValues.email],
          subject: 'Session Registration - ' + session.topic,
          html: 'Hey, this is the confirmation email for your TutorDojo session about ' + session.topic + '. This is your session link: ' + session.link + '. Thanks for signing up!'
        };

        mailgun.messages().send(data, function (err, body) {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({session: session});
          }
        });
      }).catch(function(err){
      });
    });
  };

  var requiresPayment = !req.body.free;
  if (requiresPayment) {
    payment.checkout(req, res, function (success) {
      if (success) {
        registration(req, res);
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    registration(req, res);
  }


};

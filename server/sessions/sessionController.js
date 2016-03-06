var Session = require('../../db/models').Session;
var User = require('../../db/models').User;
var Mailgun = require('mailgun-js');
var config = require('../config/config');
var http = require('http-request');
var payment = require('../payments/paymentsController.js');


module.exports.addSession = function(req, res){

  // contact appear.in to get a random video chatroom link
  // session record in db will include a link to video chat
  http.post('https://api.appear.in/random-room-name', function (err, response) {
    if (err) {
      console.error (err);
      return;
    }
    var sessionInfo = req.body;
    sessionInfo.UserId = req.user.id;
  // set the link property on req.body before passing it into Session.create
    req.body.link = ("https://appear.in" + JSON.parse(response.buffer).roomName);
    Session.create(sessionInfo).then(function (session) {
      res.send(session);
    })
    .catch(function (err) {
      console.error('Error creating session: ', err);
    });
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

module.exports.getSession = function (req, res) {
  Session.findById(req.params.sessionId).then(function (session) {
    if (session) {
      var userId = req.session.passport.user;
      if (session.UserId !== userId && session.studentId !== userId) {
        res.sendStatus(401);
        return;
      }
      session.me_id = req.session.passport.user;
      res.json({session: session});
    } else {
      res.json({err: "Session not found"});
    }
  })
  .catch(function(err) {
    console.log("ERR: ", err);
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
  console.log("HERE: ", req.session);
  if(req.session.passport && req.session.passport.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// sends an email to both user that created session and user that registers for session
module.exports.registerSession = function(req, res) {
  var requiresPayment = !req.body.free;
  if (requiresPayment) {
    payment.checkout(req, res);
    return;
  }

  var sentInfo = req.body;

  if (req.user.id !== sentInfo.studentId) {
    res.send('Error', {error: 'Error processing your request'});
    return;
  }

  Session.findById(sentInfo.sessionId, {include: [User]}).then(function (session){
    if (session.status) {
      res.send({error: 'full'});
      return;
    }
    session.status = true;
    session.studentId = sentInfo.studentId;
    session.save().then(function (){

      var mailgun = new Mailgun({ apiKey: config.mailGunAPIKey, domain: config.mailGunDomain });

      var data = {
        from: 'robot@tutordojo.herokuapp.com',
        to: [sentInfo.tuteeEmail, session.User.dataValues.email],
        subject: 'Session Registration - ' + sentInfo.topic,
        html: 'Hey, this is the confirmation email for your Learn It Now! session about ' + sentInfo.topic + '. This is your session link: ' + sentInfo.link + '. Thanks for signing up!'
      };

      mailgun.messages().send(data, function (err, body) {
        if (err) {
          res.send({ error: err });
          console.log('baderror',err);
        } else {
          res.send({session: session});
        }
      });
      }).catch(function(err){
        console.log({error: err});
      });


  });
};

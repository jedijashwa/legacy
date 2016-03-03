var Session = require('../../db/models').Session;
var User = require('../../db/models').User;
var Mailgun = require('mailgun-js');
var config = require('../config/config');
var http = require('http-request');

module.exports.addSession = function(req, res){

  // contact appear.in to get a random video chatroom link
  // session record in db will include a link to video chat
  http.post('https://api.appear.in/random-room-name', function (err, response) {
    if (err) {
      console.error (err);
      return;
    }
  // set the link property on req.body before passing it into Session.create
    req.body.link = ("https://appear.in" + JSON.parse(response.buffer).roomName);
    Session.create(req.body).then(function (session) {
      res.send(session);
    })
    .catch(function (err) {
      console.error('Error creating session: ', err);
    });
  });
};

module.exports.getSessions = function (req, res){
  Session.findAll({ where: req.body, include: [User]}).then(function (sessions) {
    if (sessions){
      res.json(sessions);
    } else {
      console.log('No sessions found');
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
      res.json({session: session});
      console.log('success');
    } else {
      res.json({err: "Session not found"});
    }
  })
  .catch(function(err) {
    console.log("ERR: ", err);
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
  if(req.user && req.user.id) {
    next();
  } else {
    res.send('Please sign in to create a session.');
  }
};

// sends an email to both user that created session and user that registers for session
module.exports.registerSession = function(req, res) {
  var mailgun = new Mailgun({ apiKey: config.mailGunAPIKey, domain: config.mailGunDomain });
  
  var data = {
    from: 'learnitnow@learnitnow.herokuapp.com',
    to: [req.body.tuteeEmail, req.body.tutorEmail],
    subject: 'Session Registration - ' + req.body.topic,
    html: 'Hey, this is the confirmation email for your Learn It Now! session about ' + req.body.topic + '. This is your session link: ' + req.body.link + '. Thanks for signing up!'
  };
  
  mailgun.messages().send(data, function (err, body) {
    if (err) {
      res.send('Error', { error: err });
    } else {
      res.send('Email sent.');
    }
  });
};
var User = require('../../db/models').User;

module.exports.newUser = function (req, res){

  User.create({ 
    username: req.body.username, 
    password: req.body.password, 
    email: req.body.email 
  })
  .then(function (user) {
    res.send({username: user.username, email: user.email});
  })
  .catch(function (err) {
    console.error('Error creating user: ', err.message);
    res.end();
  });
};

module.exports.getUsers = function(req, res){
  User.findAll().then(function (users) {
    if(!users) {
      console.log('No users found.');
      res.end();
    } else {
      res.json(users);
    }
  })
  .catch(function(err) {
    console.log('Error getting users:', err);
  });
};

// not used, not tested
module.exports.getOneUser = function (req, res) {
  User.findOne({ id: req.params.id })
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      console.error(err);
      res.end();
    });
};

// returns logged in user's info
module.exports.signIn = function (req, res) {
  req.session.regenerate(function () {
    req.session.user = {
      id: req.user.id, 
      username: req.user.username
    };
  });
  res.json({ id: req.user.id, username: req.user.username, email: req.user.email });
};

// destroys user logged-in session in server 
module.exports.signOut = function (req, res){
  req.session.destroy(function () {
    req.logout();
    res.send('Logged out.');
  });
};

module.exports.isLoggedIn = function (req, res){
  var loggedIn = false;
  if (req.user && req.user.id){
    loggedIn = true;
  }
  res.send(loggedIn);
};

// used to retrieve signed-in user's userId to attach to session that the user creates
module.exports.getSignedInUser = function(req, res){
  res.send({ UserId: req.user.id });
};
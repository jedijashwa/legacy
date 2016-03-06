// ///////////
// sequelize//
//         //

var Sequelize = require('sequelize');
if (process.env.DEPLOYED === 'true'){
  var orm = new Sequelize(process.env.JAWSDB_URL);
} else {
  var orm = new Sequelize('learnItNowdb', 'root', '');
}
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = orm.define('User', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: Sequelize.STRING
}, {
  instanceMethods: {
    hashPassword: function() {
      return bcrypt.hashSync(this.password);
    },
    validPassword: function(pass) {
      return bcrypt.compareSync(pass, this.password);
    }
  }
});

User.beforeCreate(function(user, options) {
  user.password = user.hashPassword();
});

var Session = orm.define('Session', {
  topic: Sequelize.STRING,
  description: Sequelize.STRING,
  startTime: Sequelize.DATE,
  link: Sequelize.TEXT,
  status: Sequelize.BOOLEAN,
  category: Sequelize.STRING,
  price: Sequelize.INTEGER,
  free: Sequelize.BOOLEAN,
  img: Sequelize.STRING
});

User.hasMany(Session);
User.hasMany(Session, {foreignKey: 'studentId', as: 'StudentSessions'});
Session.belongsTo(User, {foreignKey: 'UserId', as: 'User'});
Session.belongsTo(User, {foreignKey: 'studentId', as: 'Student'});

User.sync();
Session.sync();

exports.User = User;
exports.Session = Session;



/////////////
//Raw mySql//
//         //

// var mysql = require('mysql');

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'learnItNowdb'
// });

// var onConnect = connection.connect(function(err) {
//   if(err) {
//     console.log('Error connecting to mysql database: ', err);
//   } else {
//     console.log('msql databse is connected.');
//   }
// });

// module.exports.connection = connection;

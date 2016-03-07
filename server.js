var express = require('express');
var https = require('https');
var fs = require('fs');


var app = express();
var port = process.env.PORT || 3000;

https.createServer({
  key: fs.readFileSync('key.nocrypt.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(port);

require('./server/config/middleware.js')(app,express);

/*app.listen(port, function() {
  console.log('Server listening on port ' + port);
});*/

module.exports = app;

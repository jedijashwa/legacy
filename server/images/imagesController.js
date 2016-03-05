var api = require('gettyimages-api');
var creds = { apiKey: "t6zz56qn7asxaeaapbg6rrpr", apiSecret: "t9gqyWwRvBy5BmUqmHVYrCpwPwdyGnNh3yuBBTYuEj7DQ", username: "jedijashwa", password: "8iDWwEqslQ4" };
var client = new api (creds);

module.exports.getImages = function (req, res) {
  var images = [];
  client.search().images().withPage(1).withPageSize(100).withPhrase(req.body.phrase).withExcludeNudity(true)
    .execute(function(err, response) {
      if (err) throw err;
      var i = 0;
      while (i < response.images.length && images.length < 10){
        if(response.images[i].display_sizes) {
          images.push(response.images[i].display_sizes[0].uri);
        }
        i++;
      }
      if (images.length > 0) {
        res.send(images);
      } else {
        res.send('no images found');
      }
    });

};

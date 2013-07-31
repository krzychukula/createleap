var express = require("express");
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
var ip = process.env.IP || 'localhost';
app.listen(port, function() {
  console.log("Listening on " + ip + port);
});
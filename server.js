var express = require('express');
var app = express();
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.use(express.static(__dirname + '/public'));

app.all('/*', function(request, response, next) {
response.render(__dirname + '/public/index.html');
});

app.listen(port, ip);
console.log("Static server listening at http://" + ip + ":" + port);
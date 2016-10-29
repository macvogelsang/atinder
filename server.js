var express = require('express');
var bodyParser = require('body-parser');

var repository = require('./repository.js');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

app.get('*', function (req, res) {
	res.sendFile('./public/index.html');
});

app.post('/twilio/response', function (req, res) {
	console.log(req);
});

app.listen(56789, function () {
});
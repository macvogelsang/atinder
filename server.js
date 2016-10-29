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
	var event_number = req.body.To;
	var checkin_number = req.body.From;
	var content = req.body.Body;
	repository.logTwilioInbound(event_number, checkin_number, content);
});

app.listen(56789, function () {
});
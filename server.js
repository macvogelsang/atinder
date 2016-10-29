var express = require('express');
var bodyParser = require('body-parser');

var repository = require('./repository.js');
var app = express();
var port = 56789;

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

app.listen(port, function () {
	console.log("Server running at port " + port);
});
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
	var checkinNumber = req.body.From;
	var content = req.body.Body;
	repository.logTwilioInbound(checkinNumber, content);
});

app.post('/createEvent', function (req, res)) {
	var adminId = req.body.adminId;
	var name = req.body.name;
	var description = req.body.description;
	var dateStart = req.body.dateStart;
	var dateEnd = req.body.dateEnd;
	var checkStart = req.body.checkStart;
	var checkEnd = req.body.checkEnd;
	repository.createEvent(adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
}

app.listen(port, function () {
	console.log("Server running at port " + port);
});
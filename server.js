var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');


var http = require('http');
var repository = require('./repository.js');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var port = 8080;

io.sockets.on('connection', function (socket) {
	console.log("A user connected");
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

//app.get('*', function (req, res) {
//	res.sendFile('/public/index.html');
//});

app.post('/twilio/response', function (req, res) {
	var checkinNumber = req.body.From;
	var content = req.body.Body;
	repository.logTwilioInbound(checkinNumber, content, io);
});

app.post('/api/createEvent', function (req, res) {
	var adminId = req.body.adminId;
	var name = req.body.name;
	var description = req.body.description;
	var dateStart = req.body.dateStart;
	var dateEnd = req.body.dateEnd;
	var checkStart = req.body.checkStart;
	var checkEnd = req.body.checkEnd;
	repository.createEvent(adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
});

app.post('/api/getAdminPage', function (req, res) {
	var adminId = req.body.adminId;
	console.log(adminId);
	repository.getAdminPage(adminId, res);
});

app.post('/api/getEventPage', function (req, res) {
	var eventId = req.body.eventId;
	repository.getEventPage(eventId, res);
});

app.post('/api/getUserCheckIn', function (req, res) {
	var adminId = req.body.adminId;
	var number = req.body.number;
	repository.getUserCheckIn(adminId, number, res);
});

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(port, function () {
	console.log("Server running at port " + port);
});


var _ = require('lodash');
var mysql = require('mysql');
var fs = require('fs');
var twilioConfig = JSON.parse(fs.readFileSync('./config/twilioConfig.json', 'utf8'));
var mysqlConfig = JSON.parse(fs.readFileSync('./config/mysqlConfig.json', 'utf8'));
var http = require('http');

var twilio = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);

var sql = mysql.createConnection(mysqlConfig);

sql.connect(function (err) {
	console.log("Database connection established.");
	if (err) {
		console.log(err);
	}
});

var testMessage = function () {
	twilio.messages.create({
		body: "Yo Mac, this is a test message from our backend",
		to: "18123696214",
		from: "19196662564"
	}, function (err, data) {
		if (err) {
			console.log("Twilio error");
			console.log(err);
		} else {
			console.log("Message sent successfully");
		}
	});
}

var logTwilioInbound = function (event_number, checkin_number, content) {
	console.log("Message Received!");
	console.log("Text to " + event_number + " from " + checkin_number + " received.");
	console.log("Message: " + content);
}

module.exports.logTwilioInbound = logTwilioInbound;
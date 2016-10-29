var _ = require('lodash');
var mysql = require('mysql');
var twilioConfig = {
	accountSid: "AC47daeb31d1c519b3730e5b55f36e0697",
	authToken: "2e8d19d9c0300cb86c33ec01963206d8"
}
var http = require('http');

var twilio = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);

var sql = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'atinder'
});

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


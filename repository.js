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

var generateId = function (digits) {
	var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for ( var i=0; i < digits; i++ ) {
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var createEvent = function (adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res) {
	var possibleId = generateId(3);
    var query = "SELECT * FROM events WHERE eventId = '" + possibleId + "';";
    sql.query(query, function (err, recordSet) {
    	if (err) {
    		console.log(err);
    	} else {
    		if (recordSet.length != 0) {
    			createEvent(adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
    		} else {
    			eventId = possibleId;
    			createEventAdminId(eventId, adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
    		}
    	}
    });
}

var createEventAdminId = function (eventId, adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res) {
	if (adminId == "") {
		var possibleId = generateId(6);
		var query = "SELECT * FROM events WHERE adminId = '" + possibleId + "';";
		sql.query(query, function (err, recordSet) {
			if (err) {
				console.log(err);
			} else {
				if (recordSet != 0) {
					createEventAdminId(eventId, adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
				} else {
					adminId = possibleId;
					createEventFinal(eventId, adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
				}
			}
		}
	} else {
		createEventFinal(eventId, adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
	}
}

var createEventFinal = function (eventId, adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res) {
	var query = "INSERT INTO events (eventId, dateStart, dateEnd, checkStart, checkEnd, adminId, name, description, number) VALUES ('" + eventId + "', '" + dateStart + "', '" + dateEnd + "', '" + checkStart + "', '" + checkEnd + "', '" + adminId + "', '" + name + "', '" + description + "', " + number + ");");
	sql.query(query, function (err, recordSet) {
		if (err) {
			console.log(err);
		} else {
			res.send({
				adminId: adminId	
			});
		}
	});
}

module.exports.logTwilioInbound = logTwilioInbound;
module.exports.createEvent = createEvent;
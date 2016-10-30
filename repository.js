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

var escapeString = function (str) {
	return str.replace(/'/g, "''");
}
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

var logTwilioInbound = function (checkinNumber, content) {
	var currentTime = new Date();
	content = content.trim();
	var eventId = content.substring(0, 3);
	var cleanContent = content.substring(2);
	cleanContent = escapeString(cleanContent);
	var query = "SELECT checkStart, checkEnd FROM events WHERE eventId = '" + eventId + "';"
	sql.query(query, function (err, recordSet) {
		if (err) {
			console.log(err);
		} else {
			var checkStart = new Date(recordSet.checkStart);
			var checkEnd = new Date(recordSet.checkEnd);
			if (currentTime.getTime() >= checkStart.getTime() && currentTime.getTime() <= checkEnd.getTime()) {
				sendTwilioConfirmation(checkinNumber);
				var queryStore = "INSERT INTO check_ins (number, eventId, content) VALUES ('" + checkinNumber + "', '" + eventId + "', '" + cleanContent + "' )";
			} else {
				sendTwilioDeny(checkinNumber);
			}
		}
	});
}

var sendTwilioConfirmation = function (checkinNumber) {
	twilio.messages.create({
		body: "Thank you for texting in! Your attendanced has been recorded.",
		to: checkinNumber,
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

var sendTwilioDeny = function (checkinNumber) {
	twilio.messages.create({
		body: "Uh-oh, you are outside of the check in time! Please check with the event coordinator for the proper time.",
		to: checkinNumber,
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
		});
	} else {
		createEventFinal(eventId, adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
	}
}

var createEventFinal = function (eventId, adminId, number, name, description, dateStart, dateEnd, checkStart, checkEnd, res) {
	name = escapeString(name);
	description = escapeString(description);
	var query = "INSERT INTO events (eventId, dateStart, dateEnd, checkStart, checkEnd, adminId, name, description, number) VALUES ('" + eventId + "', '" + dateStart + "', '" + dateEnd + "', '" + checkStart + "', '" + checkEnd + "', '" + adminId + "', '" + name + "', '" + description + "', " + number + ");";
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

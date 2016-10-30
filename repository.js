var _ = require('lodash');
var mysql = require('mysql');
var fs = require('fs');
var twilioConfig = JSON.parse(fs.readFileSync('./config/twilioConfig.json', 'utf8'));
var mysqlConfig = JSON.parse(fs.readFileSync('./config/mysqlConfig.json', 'utf8'));
var http = require('http');
var io;

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

var logTwilioInbound = function (checkinNumber, content, io) {
	var currentTime = new Date();
	content = content.trim();
	var eventId = content.substring(0, 3);
	var cleanContent = content.substring(2);
	cleanContent = escapeString(cleanContent);
	cleanContent = cleanContent.trim();
	var query = "SELECT checkStart, checkEnd FROM events WHERE eventId = '" + eventId + "';"
	sql.query(query, function (err, recordSet) {
		if (err) {
			console.log(err);
		} else {
			console.dir(recordSet);
			if (recordSet.length != 0) {
				console.log("EventId for checkin found");
				var checkStart = new Date(recordSet.checkStart);
				var checkEnd = new Date(recordSet.checkEnd);
				console.log(checkStart.getTime());
				console.log(currentTime.getTime());
				console.log(checkEnd.getTime());
				if (currentTime.getTime() >= checkStart.getTime() && currentTime.getTime() <= checkEnd.getTime()) {
					var queryStore = "INSERT INTO check_ins (number, eventId, content) VALUES ('" + checkinNumber + "', '" + eventId + "', '" + cleanContent + "' )";
					sql.query(queryStore, function (err, recordSet) {
						if (err) {
							console.log(err);
						} else {
							sendTwilioConfirmation(checkinNumber);
							var check = {
								number: checkinNumber,
								content: cleanContent
							}
							//io.sockets.emit(eventId, check);
						}
					});
				} else {
					console.log("Time was not appropriate");
					sendTwilioDeny(checkinNumber);
				}
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
			console.log("Message Success sent successfully");
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
			console.log("Message Deny sent successfully");
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

var createEvent = function (adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res) {
	var possibleId = generateId(3);
    var query = "SELECT * FROM events WHERE eventId = '" + possibleId + "';";
	sql.query(query, function (err, recordSet) {
    	if (err) {
    		console.log(err);
    	} else {
    		if (recordSet.length != 0) {
    			createEvent(adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
    		} else {
    			eventId = possibleId;
    			createEventAdminId(eventId, adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
    		}
    	}
    });
}

var createEventAdminId = function (eventId, adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res) {
	if (adminId == "") {
		var possibleId = generateId(6);
		var query = "SELECT * FROM events WHERE adminId = '" + possibleId + "';";
		sql.query(query, function (err, recordSet) {
			if (err) {
				console.log(err);
			} else {
				if (recordSet != 0) {
					createEventAdminId(eventId, adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
				} else {
					adminId = possibleId;
					createEventFinal(eventId, adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
				}
			}
		});
	} else {
		createEventFinal(eventId, adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res);
	}
}

var createEventFinal = function (eventId, adminId, name, description, dateStart, dateEnd, checkStart, checkEnd, res) {
	var number = "19196662564";
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

var getAdminPage = function (adminId, res) {
	console.log("Getting the admin page");
	var query = "SELECT eventId, name, description, checkStart, checkEnd FROM events WHERE adminId = '" + adminId + "';";
	console.log(query);
	var queryCounts = "SELECT eventId, count(*) AS count from check_ins GROUP BY eventId";
	sql.query(query, function (err, recordSet) {
		if (err) {
			console.log(err);
		} else {
			console.dir(recordSet);
			sql.query(queryCounts, function (err, countSet) {
				console.dir(countSet);
				if (err) {
					console.log(err);
				} else {
					_.forEach(recordSet, function (record) {
						_.forEach(countSet, function (count) {
							if (record.eventId == count.eventId) {
								record.count = count.count;
							}
						});
					});
					console.dir(recordSet);
					res.send({
						events: recordSet
					});
				}
			});
		}
	})
}

module.exports.logTwilioInbound = logTwilioInbound;
module.exports.createEvent = createEvent;
module.exports.getAdminPage = getAdminPage;

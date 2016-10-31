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
	var cleanContent = content.substring(3);
	cleanContent = cleanContent.trim();
	cleanContent = escapeString(cleanContent);
	var query = "SELECT checkStart, checkEnd FROM events WHERE eventId = '" + eventId + "';"
	sql.query(query, function (err, recordSet) {
		if (err) {
			console.log(err);
		} else {
			console.dir(recordSet);
			if (recordSet.length != 0) {
				console.log("EventId for checkin found");
				var checkStart = new Date(recordSet[0].checkStart);
				var checkEnd = new Date(recordSet[0].checkEnd);
				var queryStore;
				if (currentTime.getTime() >= checkStart.getTime() && currentTime.getTime() <= checkEnd.getTime()) {
					var ronaldQuery = "SELECT * FROM check_ins WHERE number = '" + checkinNumber + "' AND eventId = '" + eventId + "';";
					sql.query(ronaldQuery, function (err, ronaldSet) {
						if (err) {
							console.log(err);
						} else {
							var newEntry;
							if (ronaldSet.length != 0) {
								queryStore = "UPDATE check_ins SET content = '" + cleanContent + "' WHERE number = '" + checkinNumber + "' AND eventId = '" + eventId + "';";
								newEntry = false;
							} else {
								queryStore = "INSERT INTO check_ins (number, eventId, content) VALUES ('" + checkinNumber + "', '" + eventId + "', '" + cleanContent + "' )";
								newEntry = true;
							}
							sql.query(queryStore, function (err, recordSet) {
								if (err) {
									console.log(err);
								} else {
									sendTwilioConfirmation(checkinNumber, newEntry);
									var check = {
										eventId: eventId,
										number: checkinNumber,
										content: cleanContent
									}
									console.log("Event emitted: " + eventId);
									io.sockets.emit(eventId.toLowerCase(), check);
								}
							});
						}
					});
				} else {
					console.log("Time was not appropriate");
					sendTwilioDeny(checkinNumber, true);
				}
			} else {
				sendTwilioDeny(checkinNumber, false);
			}
		}
	});
}

var sendTwilioConfirmation = function (checkinNumber, newEntry) {
	var body;
	if (newEntry) {
		body = "[TextIn.org] Thank you for texting in! Your attendance has been recorded.";
	} else {
		body = "[TextIn.org] You have already texted in for this event! Your submission has been updated."; 
	}
	twilio.messages.create({
		body: body,
		to: checkinNumber,
		from: twilioConfig.number
	}, function (err, data) {
		if (err) {
			console.log("Twilio error");
			console.log(err);
		} else {
			console.log("Message Success sent successfully");
		}
	});
}

var sendTwilioDeny = function (checkinNumber, timeError) {
	var body;
	if (timeError) {
		body = "[TextIn.org] Uh-oh, you are outside of the text in period for this event! Please speak with the event coordinator for more information.";
	} else {
		body = "[TextIn.org] Uh-oh, the event code you submitted does not match with any event! Please double check your event code.";
	}
	twilio.messages.create({
		body: body,
		to: checkinNumber,
		from: twilioConfig.number
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
							if (record.eventId.toLowerCase() == count.eventId.toLowerCase()) {
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

var getEventPage = function (eventId, res) {
	var query = "SELECT * FROM check_ins WHERE eventId = '" + eventId + "';";
	sql.query(query, function (err, recordSet) {
		if (err) {
			console.log(err);
		} else {
			var ronaldQuery = "SELECT * FROM events WHERE eventId = '" + eventId + "';";
			sql.query(ronaldQuery, function (err, ronaldSet) {
				if (err) {
					console.log(err);
				} else {
					res.send({
						ronaldSet: ronaldSet,
						checks: recordSet
					});
				}
			});
		}
	});
}

var getUserCheckIn = function (adminId, number, res) {
	var query = "SELECT eventId FROM check_ins WHERE number = '" + number + "';";
	sql.query(query, function (err, recordSet) {
		if (err) {
			console.log(err);
		} else {
			var eventIds = [];
			_.forEach(recordSet, function (record) {
				eventIds.push(record.eventId);
			});
			var ronaldQuery = "SELECT * FROM events WHERE eventId IN (";
			var count = 0;
			_.forEach(eventIds, function (id) {
				ronaldQuery += ("'" + id + "'");
				count++;
				if (count < eventIds.length) {
					ronaldQuery += ", ";
				} else {
					ronaldQuery += ") AND adminId = '" + adminId + "';";
				}
			});
			console.log(ronaldQuery);
			sql.query(ronaldQuery, function (err, ronaldSet) {
				if (err) {
					console.log(err);
				} else {
					res.send({
						events: ronaldSet
					});
				}
			});
		}
	});
}

module.exports.logTwilioInbound = logTwilioInbound;
module.exports.createEvent = createEvent;
module.exports.getAdminPage = getAdminPage;
module.exports.getEventPage = getEventPage;
module.exports.getUserCheckIn = getUserCheckIn;

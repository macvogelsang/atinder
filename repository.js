var _ = require('lodash');
var mysql = require('mysql');

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
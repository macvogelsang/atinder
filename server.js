var express = require('express');
var bodyParser = require('body-parser');

var repository = require('./repository.js');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

app.get('*', function (req, res) {
	res.sendFile('./public/index.html');
});

app.listen(3000, function () {
});
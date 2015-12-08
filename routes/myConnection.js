exports.myConnection = function(req, res) {

	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		database : 'facebook'
	});
	connection.connect();
	return connection;

};
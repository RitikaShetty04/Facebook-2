/*
 * GET home page.
 */
var checkLoggedInUser = require("./checkLoggedInUser.js");
var myConnection = require("./myConnection.js");

exports.index = function(req, res) {

	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		var connection = myConnection.myConnection();
		var username = req.session.loggedInUserName;
		var query = "SELECT events.event_date,events.event_description from user,events where user.user_id=events.user_id and user.user_name='"
				+ username + "';";
		connection.query(query, function(err, rows, fields) {
			if (err) {
				throw err;
			} else {
				res.render('navhome', {
					'title' : "Facebook",
					'user_events' : rows,
					'user' : req.session,
					'message' : " "
				});

			}
		});
	} else {
		res.render('login', {
			title : 'Facebook',
			error : " "
		});
	}
};
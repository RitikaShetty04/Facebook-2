global.group_id = 0;
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

exports.getGroups = function(req, res) {
	
	var username = req.session.loggedInUserName;
	// select user groups

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		var groups;
					  coll.findOne({user_name: username}, function(err, user){
						  groups=user.groups;
						  res.render('groups', {
								'rows' : groups,
								'user' : req.session,
							});
					  						 
						  }		 
					  
			);
	});
};

// display all the groups that a user is a member of
exports.displayGroup = function(req, res) {

	var selectedGroup = req.param("selected");
	console.log(selectedGroup);

};

// creating new group
exports.groupformed = function(req, res) {
	console.log("In groups");
	
	var groupname = req.param("groupname");
	var description = req.param("description");
	var username = req.session.loggedInUserName;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
	coll.update(
			  { user_name: username },
			  { $push: { "groups": { "group_description":description,"group_name":groupname} } }
			  ,function(err, user){
				  if(user)
					  {
					  var groups;
					  coll.findOne({user_name: username}, function(err, user){
						  groups=user.groups;
						  res.render('groups', {
								'rows' : groups,
								'user' : req.session,
							});
					  });
													 
						  }		 
					  }
			);
	});
	

	// retriving group_id
	/*query = "SELECT group_id FROM groups WHERE groups.group_name='" + groupname
			+ "'";
	connection.query(query, function(err, rows, fields) {
		if (err) {
			throw err;
		} else {

			global.group_id = parseInt(rows[0].group_id);
			console.log("groupid inside" + global.group_id);
		}

	});

	console.log("groupid between" + global.group_id);

	// adding to group_member table
	var query1 = "INSERT INTO facebook.group_members ( `group_id`, `user_id`) VALUES ('"
			+ global.group_id + "','" + user_id + "')";
	connection.query(query1, function(err, rows) {
		if (err) {
			console.log(err);
		}

		else {
			console.log("successful insert");
			console.log("groupid outside" + global.group_id);	
		}
		var query2 = "SELECT groups.group_name,groups.group_id from user, group_members, groups where user.user_id=group_members.user_id and groups.group_id=group_members.group_id and user.user_id='"
			+ user_id + "';";
	connection.query(query2, function(err, rows, fields) {
		if (err) {
			throw err;
		} else {
			// console.log(" rows"+rows);
			res.render("Groups", {
				"rows" : rows,
				"user" : req.session
			});

		}

	});
		
	});
*/
};

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";
/**
 * New node file
 */
// login function

exports.login = function(req, res) {
	var username, password;
	username = req.param("username");
	password = req.param("password");
	//new
	console.log(username + password);
	var json_responses;
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');

		coll.findOne({user_name: username, user_pass:password}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//session parameters
				req.session.username = user.user_name;
				
				console.log(req.session.username +" is the session");
				req.session.id=user._id;
				console.log(req.session.id +" is the ID of the user");
				req.session.loggedInUserId = user.user_id;
				req.session.loggedInUserFname = user.user_fname;
				req.session.loggedInUserLname = user.user_lname;
				req.session.loggedInUserName = user.user_name;
				req.session.loggedInEmail = user.user_email;
				req.session.loggedInDOB = user.user_dob;
				req.session.loggedInSex = user.user_sex;
				req.session.loggedInPhone = user.user_phone;

				req.session.loggedInworkorg = user.user_work_organisation;
				req.session.loggedInworkexp = user.user_workexp;
				req.session.loggedInworkpos = user.user_work_position;

				req.session.loggedIninterests = user.user_interest;
				
				req.session.loggedInEvents = user.events;
				req.session.loggedInFriends = user.friends;
				req.session.loggedInGroups = user.groups;
				
				console.log("events "+req.session.loggedInEvents);
				
				res.render("navhome", {
					'title' : "Facebook",
					'user' : req.session,
					'rows' : "",
					'user_events': req.session.loggedInEvents,
					'message' : ""
				});
				console.log("login successfull");
			} 
			else if(err)
				{
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
				console.log("Error occured:line 41" +err);
				}
		
			else {
				//user doesnt exist
				console.log("returned false");
				res.render("login", {
					title : 'Facebook',
					error : "Incorrect username or password"
				});
				console.log("login fail");
			}
		});
	});

};

// function to display signup page
exports.signup = function(req, res) {
	var error;
	res.render("signup", {
		error : error
	});
};

// function for signup
exports.aftersignup = function(req, res) {
	var first_name, last_name, email, password, password1, phone, sex, dob, username;
	password = req.param("password");
	password1 = req.param("password1");
	first_name = req.param("first_name");
	last_name = req.param("last_name");
	phone = req.param("phone");
	sex = req.param("sex");
	dob = req.param("dob").toString();
	email = req.param("email");
	username = req.param("user_name");
	var connection = module.exports.myConnection();

	//password entered twice does'nt match
	if (password !== password1) {

		res.render("signup", {
			title : 'Facebook',
			error : "Passwords do not match enter again"
		});
	}
	
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');

		coll.findOne({user_name: username}, function(err, user){
			if (user) {
				//if username already exists
				console.log("-user already exists");
				res.render("signup", {
					error : "Username already exists, choose another username"
				});
			} 
			else if(err)
				{
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
				console.log("Error occured:line 124 " +err);
				}
		
			else {
				//user doesnt exist
				
				coll.insert( {"user_name": username,"user_pass": password, "user_fname": first_name, "user_lname": last_name, "user_phone":phone, "user_sex":sex, "user_dob":dob, "user_email":email}, function(err, user){
					if (user) {
						// This way subsequent requests will know the user is logged in.
						console.log("successful signup");
						res.render("signup", {error : "Successful signup, login to continue"});

					} else {
						console.log("Insert failed");
					}
				});
		}
});
	});
};

exports.checkLoggedInUser = function(req, res) {

	if (typeof req.session.loggedInUserFname === "undefined") {
		return false;

	} else {
		return true;
	}

};

exports.Logout = function(req, res) {
	req.session.destroy();
	console.log("Session destroyed :" +req.session);
	res.render("login", {
		title : 'Login',
		error : 'You have logged out successfully'
	});

};
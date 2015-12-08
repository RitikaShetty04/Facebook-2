var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

// Export myConnection and checkloggedInUser js files

var checkLoggedInUser = require("./checkLoggedInUser.js");

// function to add events

exports.addevent = function(req, res) {

	
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		// retrieve values using session parameters
				
		var username = req.session.loggedInUserName;
		var event_description = req.param("event_description");
		var date = req.param("event_date");
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			
			//insert events in users
		coll.update(
					  { user_name: username },
					  { $push: { "events": { "event_description":event_description,"event_date":date} } }
					  ,function(err, user){
						  if(user)
							  {
							  var events;
							  coll.findOne({user_name: username}, function(err, user){
								  events=user.events;
								  res.render('navhome', {
										'title' : "Facebook",
										'user_events' : events,
										'user' : req.session,
										'message' : "Event added successfully"
									});
							  });
															 
								  }		 
							  }
					);				  
						  
		});
			
		}
};
		

		